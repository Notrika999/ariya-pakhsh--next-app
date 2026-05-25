import React from 'react'

export default function StepReset() {
  return (
    <div className="space-y-3">

      <input
        type="password"
        placeholder="رمز عبور جدید"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="password"
        placeholder="تکرار رمز عبور"
        className="w-full border rounded-xl p-3"
      />

      <button className="w-full bg-primary text-white py-3 rounded-xl">
        تغییر رمز عبور
      </button>

    </div>
  )
}
