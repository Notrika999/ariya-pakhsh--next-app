import React from 'react'

export default function StepMobile({ mobile, setMobile, onNext }) {
  return (
    <>

      <input
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="09xxxxxxxxx"
        className="w-full border rounded-xl p-3 mb-4"
      />

      <button
        onClick={onNext}
        className="w-full bg-primary text-white py-3 rounded-xl"
      >
        ادامه
      </button>
    </>
  )
}
