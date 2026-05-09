"use client"
import React, { useState } from "react";
import UserSidebar from "../UserSidebar";
import SidebarResponsive from "../SidebarResponsive";
import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import OrdersReturnTop from "./OrdersReturnTop";
import ReturnProducts from "./formContent/ReturnProducts";
import ReturnReasons from "./formContent/ReturnReasons";
import AdditionalDetails from "./formContent/AdditionalDetails";
import RefundMethod from "./formContent/RefundMethod";
import BankDetails from "./formContent/BankDetails";
import UploadDocuments from "./formContent/UploadDocuments";
import ReturnSummary from "./formContent/ReturnSummary";
import ReturnTerms from "./formContent/ReturnTerms";
import SubmitSection from "./formContent/SubmitSection";

export default function OrdersReturn() {
  const [formData, setFormData] = useState({
    products: {
      product1: { checked: false, quantity: 1, condition: "unopened" },
      product2: { checked: false, quantity: 1, condition: "unopened" },
    },
    returnReason: "",
    details: "",
    refundMethod: "wallet",
    bankDetails: { bankName: "", sheba: "", cardNumber: "", owner: "" },
    documents: [],
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNested = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  console.log(formData)

  //   const formData = {
  //   products: {
  //     product1: {
  //       checked: false,
  //       quantity: 1,
  //       condition: "unopened",
  //     },
  //     product2: {
  //       checked: false,
  //       quantity: 1,
  //       condition: "unopened",
  //     }
  //   },
  //   returnReason: "",
  //   details: "",
  //   refundMethod: "wallet",
  //   bankDetails: {
  //     bankName: "",
  //     sheba: "",
  //     cardNumber: "",
  //     owner: "",
  //   },
  //   documents: [],
  // };

  return (
    <div className="lg:col-span-3 space-y-8">
      {/* <!--Dashboard header--> */}
      <OrdersReturnTop />

      {/* <!--Return Request Form--> */}
      <div className="bg-white rounded-2xl drop-shadow-lg p-6 dark:bg-custom-dark dark:border dark:border-gray-700">
        <TitleAfter title={"فرم درخواست مرجوعی"} />

        <form className="space-y-8" id="returnForm">
          <ReturnProducts products={formData.products}
        onChange={(key, value) => updateNested("products", key, value)} />
          <ReturnReasons value={formData.returnReason}
        onChange={(value) => updateField("returnReason", value)} />
          <AdditionalDetails value={formData.details}
        onChange={(value) => updateField("details", value)} />
          <RefundMethod value={formData.refundMethod}
        onChange={(value) => updateField("refundMethod", value)} />
          <BankDetails value={formData.bankDetails}
        onChange={(key, value) => updateNested("bankDetails", key, value)} />
          <UploadDocuments files={formData.documents}
        onChange={(files) => updateField("documents", files)} />
          <ReturnSummary products={formData.products} />
          <ReturnTerms products={formData.products}
  refundMethod={formData.refundMethod} />
          <SubmitSection onSubmit={() => console.log(formData)} />
        </form>
      </div>
    </div>
  );
}
