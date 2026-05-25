import React from "react";

export default function LoginWithPass() {
  return (
    <div className="space-y-3">
      <input
        placeholder="نام کاربری"
        className="w-full border rounded-xl p-3"
      />

      <input
        type="password"
        placeholder="رمز عبور"
        className="w-full border rounded-xl p-3"
      />

      <button className="w-full bg-primary text-white py-3 rounded-xl">
        ورود
      </button>
    </div>
  );
}
