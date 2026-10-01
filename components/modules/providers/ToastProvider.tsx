"use client";
// components/modules/providers/ToastProvider.tsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      rtl
      position="top-right"
      className="!z-[2147483647]"
      style={{ zIndex: 2147483647 }}
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
      toastClassName="!rounded-xl"
    />
  );
}
