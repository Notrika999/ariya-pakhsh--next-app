import React, { useState } from 'react'

export default function StepOtp({ mobile, onVerify, onBack }) {
    const [code, setCode] = useState("");

  
  return (
     <>
      <p className="text-center mb-4">
        کد تایید برای {mobile} ارسال شد
      </p>

      <input
      value={code}
        onChange={(e) => setCode(e.target.value)}
        type="text"
        maxLength={4}
        className="w-full text-center text-2xl border rounded-xl p-3 mb-4"
        placeholder="_ _ _ _"
      />

      <button
        onClick={() => onVerify(code)}
        className="w-full bg-primary text-white py-3 rounded-xl mb-3"
      >
        تایید
      </button>

      <button onClick={onBack} className="text-sm text-gray-500 w-full">
        بازگشت
      </button>
    </>
  )
}
