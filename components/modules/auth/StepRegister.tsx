import React from 'react'

export default function StepRegister() {
  return (
     <div className="space-y-3">

      <input
        placeholder="نام"
        className="w-full border rounded-xl p-3"
      />

      <input
        placeholder="نام خانوادگی"
        className="w-full border rounded-xl p-3"
      />
      
      <input
        placeholder="ایمیل"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="password"
        placeholder="رمز عبور"
        className="w-full border rounded-xl p-3"
      />

      <button className="w-full bg-primary text-white py-3 rounded-xl">
        ثبت نام و ورود
      </button>

    </div>
  )
}
