/**
 * Pure helper utilities for the CAPTCHA component.
 *
 * Keeping these in a separate module makes them trivially testable
 * and isolates the non-React logic from rendering concerns.
 */

import type { CaptchaCharsetOptions } from "./Captcha.types";

/** Default charset configuration — uppercase letters and digits. */
const DEFAULT_CHARSET_OPTIONS: Required<CaptchaCharsetOptions> = {
  uppercase: true,
  lowercase: false,
  numbers: true,
  extras: "",
  ambiguousExclusions: ["0", "O", "I", "l", "1"],
};

/**
 * Build the final pool of characters that the generator may pick from.
 * Returns a non-empty string — falls back to digits if everything is disabled.
 */
export function buildCharset(options: CaptchaCharsetOptions | undefined): string {
  const opts = { ...DEFAULT_CHARSET_OPTIONS, ...(options ?? {}) };
  let pool = "";

  if (opts.numbers) pool += "0123456789";
  if (opts.extras) pool += opts.extras;

  if (opts.ambiguousExclusions && opts.ambiguousExclusions.length > 0) {
    const excl = new Set(opts.ambiguousExclusions);
    pool = pool
      .split("")
      .filter((c) => !excl.has(c))
      .join("");
  }

  // Safety net — never hand back an empty pool.
  if (pool.length === 0) pool = "0123456789";
  return pool;
}

/**
 * Generate a random CAPTCHA string of the requested length.
 * Uses `crypto.getRandomValues` when available for stronger randomness.
 */
export function generateCaptchaText(
  length: number,
  charsetOptions: CaptchaCharsetOptions | undefined,
): string {
  const safeLength = Math.max(1, Math.min(length, 32));
  const pool = buildCharset(charsetOptions);
  const poolLength = pool.length;

  // Prefer the WebCrypto API for better entropy.
  const randomBytes = new Uint32Array(safeLength);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < safeLength; i++) randomBytes[i] = Math.floor(Math.random() * 0xffffffff);
  }

  let result = "";
  for (let i = 0; i < safeLength; i++) {
    result += pool[randomBytes[i] % poolLength];
  }
  return result;
}

/** A single noise element drawn on the CAPTCHA canvas. */
interface NoiseSpec {
  type: "line" | "dot";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width: number;
}

/**
 * Draw the CAPTCHA text onto a canvas with intentional distortion:
 *   - a faint gradient background
 *   - per-character rotation and vertical jitter
 *   - variable spacing and scale
 *   - random line and dot noise
 *
 * The distortion is deterministic per `(text, width, height)` tuple
 * because we seed our pseudo-random generator with a hash of those values,
 * making sure server and client (if SSR'd in the future) could agree.
 */
export function drawCaptcha(
  canvas: HTMLCanvasElement,
  text: string,
  width: number,
  height: number,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Reset transform & size in case the canvas was reused.
  canvas.width = width;
  canvas.height = height;

  // Background — soft, light gradient.
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#f3f4f6");
  bg.addColorStop(1, "#e5e7eb");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle background grid for extra texture.
  ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 12) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Deterministic pseudo-random number generator so the distortion
  // looks consistent across re-renders for the same text/dimensions.
  let seed = hash(text + width + height);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  // Pick a palette of dark, high-contrast colours for the text.
  const palette = ["#1e3a8a", "#064e3b", "#7c2d12", "#4c1d95", "#0f172a"];

  // Pre-build the noise so it can be drawn before/after the text
  // depending on how much obfuscation we want.
  const noise: NoiseSpec[] = [];
  for (let i = 0; i < 6; i++) {
    noise.push({
      type: "line",
      x1: rand() * width,
      y1: rand() * height,
      x2: rand() * width,
      y2: rand() * height,
      color: palette[Math.floor(rand() * palette.length)],
      width: 1 + rand() * 1.5,
    });
  }
  for (let i = 0; i < 80; i++) {
    noise.push({
      type: "dot",
      x1: rand() * width,
      y1: rand() * height,
      x2: 0,
      y2: 0,
      color: palette[Math.floor(rand() * palette.length)],
      width: 1 + rand() * 1.5,
    });
  }

  // Draw background noise first so characters read on top of it.
  noise.slice(0, Math.ceil(noise.length / 2)).forEach((n) => drawNoise(ctx, n));

  // Draw each character individually with rotation + y-jitter.
  const padding = 16;
  const availableWidth = width - padding * 2;
  const charWidth = availableWidth / Math.max(text.length, 1);
  const baseFontHeight = height * 0.55;

  ctx.textBaseline = "middle";
  ctx.font = `bold ${baseFontHeight}px "Courier New", monospace`;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const cx = padding + charWidth * i + charWidth / 2;
    const cy = height / 2 + (rand() - 0.5) * (height * 0.18); // vertical jitter
    const angle = (rand() - 0.5) * 0.7; // ~±20°
    const scale = 0.85 + rand() * 0.3;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.fillStyle = palette[i % palette.length];
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  }

  // Foreground noise — over the characters — to break up OCR.
  noise.slice(Math.ceil(noise.length / 2)).forEach((n) => drawNoise(ctx, n));
}

/** Draw a single noise element onto the canvas context. */
function drawNoise(ctx: CanvasRenderingContext2D, n: NoiseSpec): void {
  ctx.strokeStyle = n.color;
  ctx.fillStyle = n.color;
  ctx.lineWidth = n.width;
  if (n.type === "line") {
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(n.x1, n.y1);
    ctx.lineTo(n.x2, n.y2);
    ctx.stroke();
  } else {
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(n.x1, n.y1, n.width, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Tiny string hash → 32-bit unsigned integer. */
function hash(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
