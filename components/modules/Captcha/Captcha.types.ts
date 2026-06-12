/**
 * Type definitions for the CAPTCHA component.
 *
 * These types are exported so consumers can type their own
 * handler functions and prop overrides.
 */

/** Configuration describing which characters may appear in the CAPTCHA. */
export interface CaptchaCharsetOptions {
  /** Include uppercase letters A-Z. Defaults to true. */
  uppercase?: boolean;
  /** Include lowercase letters a-z. Defaults to false. */
  lowercase?: boolean;
  /** Include digits 0-9. Defaults to true. */
  numbers?: boolean;
  /** Additional characters to allow (e.g. "+-="). Defaults to empty. */
  extras?: string;
  /**
   * Characters that should be excluded because they look ambiguous
   * (0/O, 1/l/I, etc.). Pass null to keep everything.
   */
  ambiguousExclusions?: string[] | null;
}

/** Public props accepted by the <Captcha /> component. */
export interface CaptchaProps {
  /** Number of characters in the CAPTCHA (4-8 recommended). */
  length?: number;
  /** Canvas width in pixels. */
  width?: number;
  /** Canvas height in pixels. */
  height?: number;
  /** Character set configuration. */
  charset?: CaptchaCharsetOptions;
  /** Whether the user's input must match the CAPTCHA case-sensitively. */
  caseSensitive?: boolean;
  /**
   * If > 0, automatically refresh the CAPTCHA every N milliseconds.
   * Set to 0 (default) to disable auto-refresh.
   */
  autoRefreshInterval?: number;
  /**
   * Called whenever the validation state changes. Useful when the
   * parent form needs to know whether the CAPTCHA is currently valid.
   */
  onValidate?: (isValid: boolean, value: string) => void;
  /**
   * Called as soon as the user submits the value via the Enter key or
   * a click on the validate button. Returns the comparison result.
   */
  onSubmit?: (isValid: boolean, value: string) => void;
  /** Placeholder shown in the input field. */
  placeholder?: string;
  /**
   * Disable internal validation UI and let the parent call
   * `validate()` imperatively via a ref. When true, the component
   * renders the input without an inline submit button.
   */
  controlledValidation?: boolean;
  /** Optional className applied to the root wrapper. */
  className?: string;
}

/** Imperative handle exposed through `ref` when controlledValidation is used. */
export interface CaptchaHandle {
  /** Force a refresh of the CAPTCHA image. */
  refresh: () => void;
  /** Validate `value` against the current CAPTCHA. */
  validate: (value: string) => boolean;
  /** Get the current CAPTCHA text (use only for testing). */
  getCaptchaText: () => string;
}
