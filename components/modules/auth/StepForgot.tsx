import React from 'react'

export default function StepForgot({ mobile, onNext, onBack }) {
  return (
    <>
      <p className="text-sm text-gray-500 mb-4 text-center">
        کد بازیابی برای {mobile} ارسال خواهد شد
      </p>

      <button
        onClick={onNext}
        className="w-full bg-primary text-white py-3 rounded-xl mb-3"
      >
        ارسال کد
      </button>

      <button onClick={onBack} className="text-sm text-gray-500 w-full">
        بازگشت
      </button>
    </>
  )
}
