export type UnsafeInputViolation = {
  path: string;
  reason: string;
};

export class UnsafeInputError extends Error {
  constructor(public readonly violations: UnsafeInputViolation[]) {
    super("Unsafe input detected");
    this.name = "UnsafeInputError";
  }
}

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const DANGEROUS_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /<\s*\/?\s*script\b/i, reason: "script tag" },
  { pattern: /<\s*\/?\s*iframe\b/i, reason: "iframe tag" },
  { pattern: /<\s*\/?\s*object\b/i, reason: "object tag" },
  { pattern: /<\s*\/?\s*embed\b/i, reason: "embed tag" },
  { pattern: /<\s*\/?\s*link\b/i, reason: "link tag" },
  { pattern: /<\s*\/?\s*meta\b/i, reason: "meta tag" },
  { pattern: /<\s*\/?\s*style\b/i, reason: "style tag" },
  { pattern: /<\s*\/?\s*svg\b/i, reason: "svg tag" },
  { pattern: /\bon[a-z]+\s*=/i, reason: "inline event handler" },
  { pattern: /\bjavascript\s*:/i, reason: "javascript URL" },
  { pattern: /\bdata\s*:\s*text\/html/i, reason: "HTML data URL" },
  { pattern: /\bvbscript\s*:/i, reason: "vbscript URL" },
  { pattern: /\bexpression\s*\(/i, reason: "CSS expression" },
];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasFileLikeValues(): boolean {
  return typeof File !== "undefined" || typeof Blob !== "undefined";
}

function isFileLike(value: unknown): boolean {
  if (!hasFileLikeValues()) return false;
  return (
    (typeof File !== "undefined" && value instanceof File) ||
    (typeof Blob !== "undefined" && value instanceof Blob)
  );
}

function inspectString(value: string, path: string): UnsafeInputViolation[] {
  const violations: UnsafeInputViolation[] = [];

  if (CONTROL_CHARS.test(value)) {
    violations.push({ path, reason: "control character" });
  }

  for (const { pattern, reason } of DANGEROUS_PATTERNS) {
    if (pattern.test(value)) {
      violations.push({ path, reason });
    }
  }

  return violations;
}

function collectViolations(
  value: unknown,
  path: string,
  seen: WeakSet<object>,
): UnsafeInputViolation[] {
  if (typeof value === "string") {
    return inspectString(value, path);
  }

  if (
    value == null ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "symbol" ||
    typeof value === "function" ||
    isFileLike(value)
  ) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectViolations(item, `${path}[${index}]`, seen),
    );
  }

  if (value instanceof URLSearchParams) {
    const violations: UnsafeInputViolation[] = [];
    value.forEach((item, key) => {
      violations.push(...collectViolations(item, `${path}.${key}`, seen));
    });
    return violations;
  }

  if (typeof FormData !== "undefined" && value instanceof FormData) {
    const violations: UnsafeInputViolation[] = [];
    value.forEach((item, key) => {
      if (typeof item === "string") {
        violations.push(...inspectString(item, `${path}.${key}`));
      }
    });
    return violations;
  }

  if (value instanceof Date) return [];

  if (typeof value === "object") {
    if (seen.has(value)) return [];
    seen.add(value);

    if (!isPlainObject(value)) return [];

    return Object.entries(value).flatMap(([key, item]) =>
      collectViolations(item, path ? `${path}.${key}` : key, seen),
    );
  }

  return [];
}

export function getUnsafeInputViolations(
  value: unknown,
): UnsafeInputViolation[] {
  return collectViolations(value, "payload", new WeakSet<object>());
}

export function assertSafeInput(value: unknown): void {
  const violations = getUnsafeInputViolations(value);
  if (violations.length > 0) {
    throw new UnsafeInputError(violations);
  }
}
