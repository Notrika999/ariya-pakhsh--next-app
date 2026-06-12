/**
 * Example integration of <Captcha /> inside a typical form.
 *
 * Demonstrates:
 *   • listening for validation events
 *   • disabling form submission until the CAPTCHA is valid
 *   • using the imperative ref API to validate on submit
 *   • customising length, dimensions, and character set
 */

import { FormEvent, useRef, useState } from "react";
// import { Captcha } from "./index";
import type { CaptchaHandle } from "./index";

export default function Captcha() {
  const captchaRef = useRef<CaptchaHandle | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaRef.current || !captchaValid) return;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-xl font-semibold text-slate-900">
        Contact us
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        Please complete the CAPTCHA before submitting.
      </p>

      {submitted ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
        >
          <p className="font-medium">Thanks {name || "friend"}! 🎉</p>
          <p className="text-sm">Your message has been queued for review.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
       
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              CAPTCHA
            </label>
            <Captcha
              ref={captchaRef}
              length={6}
              width={220}
              height={88}
              caseSensitive={false}
              autoRefreshInterval={60_000}
              charset={{ uppercase: true, lowercase: false, numbers: true }}
              onValidate={(isValid) => setCaptchaValid(isValid)}
              onSubmit={(isValid) => {
                if (isValid) setSubmitted(true);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!captchaValid}
            className={[
              "w-full rounded-md px-4 py-2 text-sm font-medium text-white transition",
              captchaValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-300",
            ].join(" ")}
          >
            Send message
          </button>
        </form>
      )}
    </div>
  );
}
