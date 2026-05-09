import React from "react";

export default function OrdersFactor() {
  return (
    <section className="py-5">
      <div className="container mx-auto">
        {/* <!-- main content --> */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* <!-- Buttons --> */}
            <div className="mb-6 flex justify-end gap-3 no-print">
              <button
                onClick="window.print()"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                چاپ فاکتور
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-300/80">
                دانلود PDF
              </button>
            </div>

            {/* <!--Invoice body--> */}
            <div className="invoice-box bg-white rounded-xl shadow-md p-8 border border-gray-200 print:shadow-none print:border-none print:max-w-[794px] print:mx-auto print:w-full print:text-black">
              {/* <!-- heather --> */}
              <div className="flex flex-row justify-between items-center  gap-4 mb-8 border-b pb-6">
                {/* <!--right side--> */}
                <div className="text-start">
                  <h2 className="text-2xl print:text-xl font-bold text-primary">
                    فروشگاه دیارا
                  </h2>
                  <p className="text-sm text-gray-600">
                    تهران، خیابان ولیعصر، پلاک ۱۲۳۴
                    <br />
                    تلفن: ۰۲۱-۱۲۳۴۵۶۷۸
                    <br /> شماره اقتصادی: ۱۲۳۴۵۶۷۸۹{" "}
                  </p>
                </div>

                {/* <!--left side--> */}
                <div className="text-end">
                  <h1 className="text-3xl print:text-xl font-bold mb-2">
                    فاکتور فروش
                  </h1>
                  <div className="text-sm space-y-1 text-gray-600">
                    <p>شماره فاکتور: #INV-8542</p>
                    <p>تاریخ صدور: ۱۴۰۲/۰۳/۲۰</p>
                    <p>زمان: ۱۴:۴۵</p>
                  </div>
                </div>
              </div>

              {/* <!--Customer and vendor information--> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-600">
                <div>
                  <h3 className="text-sm font-medium mb-2">فروشنده:</h3>
                  <p>
                    فروشگاه الکترونیک دیارا
                    <br />
                    حساب بانکی: ۱۲۳۴-۵۶۷۸-۹۰۱۲-۳۴۵۶
                    <br />
                    بانک ملت
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">مشتری:</h3>
                  <p>
                    علی محمدی
                    <br />
                    تلفن: ۰۹۱۲۳۴۵۶۷۸۹
                    <br />
                    آدرس: تهران، خیابان انقلاب، کوچه شهید فلانی، پلاک ۱۲
                  </p>
                </div>
              </div>

              {/* <!--Table of products--> */}
              <div className="mb-8 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-start py-3 px-4 font-medium">
                        محصول
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        قیمت واحد
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        تعداد
                      </th>
                      <th className="text-end py-3 px-4 font-medium">
                        مبلغ کل
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <img
                            src="/images/product/wach-3.png"
                            className="w-12 h-12 rounded-lg object-cover me-3"
                          />
                          <div>
                            <p className="font-medium">
                              هدفون بی‌سیم WH-1000XM4
                            </p>
                            <p className="text-xs text-gray-500">کد: PRD-001</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">۸۵۰,۰۰۰ تومان</td>
                      <td className="py-3 px-4 text-center">۱</td>
                      <td className="py-3 px-4 text-end">۸۵۰,۰۰۰ تومان</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <img
                            src="/images/product/wach-1.png"
                            className="w-12 h-12 rounded-lg object-cover me-3"
                          />
                          <div>
                            <p className="font-medium">
                              هدفون بی‌سیم WH-1000XM4
                            </p>
                            <p className="text-xs text-gray-500">کد: PRD-001</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">۸۵۰,۰۰۰ تومان</td>
                      <td className="py-3 px-4 text-center">۱</td>
                      <td className="py-3 px-4 text-end">۸۵۰,۰۰۰ تومان</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* <!--Financial calculations--> */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">جمع کل:</span>
                    <span className="font-medium">۱,۲۵۰,۰۰۰ تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تخفیف:</span>
                    <span className="text-red-600">-۵۰,۰۰۰ تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">مالیات:</span>
                    <span className="font-medium">۱۸۷,۵۰۰ تومان</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-bold">مبلغ قابل پرداخت:</span>
                    <span className="font-bold text-blue-600">
                      ۱,۳۸۷,۵۰۰ تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* <!--Final explanation--> */}
              <div className="mt-8 pt-6 border-t text-xs text-gray-500 text-center">
                <p>
                  مبلغ به حروف: یک میلیون و سیصد و هشتاد و هفت هزار و پانصد
                  تومان
                </p>
                <p className="mt-2">
                  مهلت پرداخت: ۷۲ ساعت • شرایط بازگشت کالا مطابق قوانین فروشگاه
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
