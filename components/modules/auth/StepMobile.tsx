import React, { useRef, useState } from "react";
import Captcha from "../Captcha";
import type { CaptchaHandle } from "../Captcha";

export default function StepMobile({ mobile, setMobile, onNext }) {
  const captchaRef = useRef<CaptchaHandle | null>(null);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");

  const handleNext = () => {
    if (!captchaRef.current) return;
    const isValid = captchaRef.current.validate(captchaInput);
    if (isValid) onNext();
  };

  return (
    <>
      <input
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="09xxxxxxxxx"
        className="w-full border rounded-xl p-3 mb-4"
      />
      <Captcha
        ref={captchaRef}
        length={6}
        width={220}
        height={45}
        caseSensitive={false}
        charset={{ uppercase: true, lowercase: false, numbers: true }}
        controlledValidation={false}
        onValidate={(isValid, value) => {
          setCaptchaValid(isValid);
          setCaptchaInput(value);
        }}
      />
      <button
        onClick={handleNext}
        disabled={!captchaValid}
        className={[
          "w-full py-3 rounded-xl text-white transition",
          captchaValid && Number(mobile)
            ? "bg-primary hover:opacity-90"
            : "bg-slate-300 cursor-not-allowed",
        ].join(" ")}
      >
        ادامه
      </button>
    </>
  );
}
