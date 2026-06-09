// "use client";
// import React, { useState } from "react";

// const pColors = {
//   colors: ["آبی", "سبز", "قرمز"],
//   defaultColor: "آبی",
// };
// export default function Description({ product, isOutOfStock }) {
//   const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
//   console.log(product);
//   return (
//     <section className="xl:col-span-5 mt-7 col-span-12 pb-10 w-full dark:text-gray-200">
//       {/* <!-- Category --> */}
//       <ul className="space-x-2 flex items-center">
//         <li>
//           <a href="" className="text-primary">
//             اپل
//           </a>
//         </li>
//         <li className="text-gray-400 dark:text-gray-500">/</li>
//         <li>
//           <a href="" className="text-primary">
//             گوشی اپل
//           </a>
//         </li>
//       </ul>

//       {/* <!-- Title --> */}
//       <div className="space-y-2 mt-2 pb-2 border-b border-b-gray-300 dark:border-b-gray-700">
//         {/* <!-- Fa title --> */}
//         <h2 className="font-black  leading-8">{product.title}</h2>

//         {/* <!-- En title --> */}
//         <h2 className="text-gray-400 dark:text-gray-500 text-sm leading-8">
//           Samsung Galaxy Watch5 44mm Smartwatch
//         </h2>
//       </div>

//       {/* <!-- Rating , Comments and Question --> */}
//       <div className="flex flex-wrap items-center pt-2 mt-2 space-x-2">
//         {/* <!-- Rating --> */}
//         <div className="flex items-center space-x-1">
//           <i className="fas fa-star text-amber-400"></i>

//           <h4 className="text-sm font-bold">4.6</h4>
//           <span className="text-xs text-gray-400 dark:text-gray-500">
//             (امتیاز ۳۰۸ خریدار)
//           </span>
//         </div>

//         {/* <!-- Comments --> */}
//         <div>
//           <a
//             href="#comments"
//             className="bg-gray-200 hover:bg-primary/20 transition dark:bg-zinc-800 dark:text-gray-200 px-2 py-1 space-x-1 rounded-full flex items-center"
//           >
//             <span className="text-xs">185 دیدگاه </span>
//             <i className="far fa-angle-left"></i>
//           </a>
//         </div>

//         {/* <!-- Question --> */}
//         <div>
//           <a
//             href="#question"
//             className="bg-gray-200 hover:bg-primary/20 transition dark:bg-zinc-800 dark:text-gray-200 px-2 py-1 space-x-1 rounded-full flex items-center"
//           >
//             <span className="text-xs">265 پرسش </span>
//             <i className="far fa-angle-left"></i>
//           </a>
//         </div>
//       </div>

//       {/* <!-- Out of Stock Notice --> */}
//       {isOutOfStock && (
//         <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
//           <div className="flex items-center space-x-2">
//             <i className="far fa-exclamation-triangle text-red-500"></i>
//             <span className="text-red-700 dark:text-red-300 font-medium">
//               این محصول در حال حاضر موجود نمی‌باشد
//             </span>
//           </div>

//           <p className="text-red-600 dark:text-red-400 text-sm mt-2">
//             می‌توانید از طریق دکمه زیر، در صورت موجود شدن به شما اطلاع‌رسانی
//             کنیم.
//           </p>
//         </div>
//       )}

//       {/* <!-- Color Picker --> */}
//       <div className="mt-6 space-y-4">
//         {/* Title */}
//         <div className="flex items-center gap-2">
//           <span
//             className="
//              w-4 h-4 rounded-full border
//             "
//             style={{
//               background: Array.isArray(selectedColor.code)
//                 ? `linear-gradient(
//                     90deg,
//                     ${selectedColor.code[0]} 0%,
//                     ${selectedColor.code[0]} 50%,
//                     ${selectedColor.code[1]} 50%,
//                     ${selectedColor.code[1]} 100%
//                   )`
//                 : selectedColor.code,
//             }}
//           />
//           <p className="font-semibold text-lg">رنگ: {selectedColor?.title}</p>
//         </div>

//         {/* Colors */}
//         <div className="flex items-center gap-4">
//           {product.colors.slice(0, 2).map((color) => {
//             const isActive = selectedColor?.id === color.id;

//             return (
//               <button
//                 key={color.id}
//                 type="button"
//                 disabled={isOutOfStock}
//                 onClick={() => !isOutOfStock && setSelectedColor(color)}
//                 className="
//             relative
//             w-12
//             h-12
//             rounded-full
//             flex
//             items-center
//             justify-center
//           "
//               >
//                 {/* Outer Active Ring */}
//                 {isActive && (
//                   <span
//                     className="
//                 absolute
//                 inset-0
//                 rounded-full
//                 ring-4
//                 ring-sky-400
//               "
//                   />
//                 )}

//                 {/* Color Circle */}
//                 <span
//                   className="
//               relative
//               z-10
//               w-8
//               h-8
//               rounded-full
//               border
//               border-gray-300
//               flex
//               items-center
//               justify-center
//             "
//                   style={{
//                     background: Array.isArray(color.code)
//                       ? `linear-gradient(
//                     90deg,
//                     ${color.code[0]} 0%,
//                     ${color.code[0]} 50%,
//                     ${color.code[1]} 50%,
//                     ${color.code[1]} 100%
//                   )`
//                       : color.code,
//                   }}
//                 >
//                   {/* Check Icon */}
//                   {isActive && (
//                     <svg
//                       className="w-4 h-4 text-white"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                   )}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* <!-- Feature --> */}
//       <div className="mt-8 space-y-3">
//         <div className="flex items-center space-x-2">
//           <h4 className="font-bold text-lg">ویژگی ها</h4>
//         </div>

//         <div className="grid gap-3 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
//           {/* <!-- Items --> */}
//           <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
//             <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
//               نوع صفحه نمایش
//             </h5>
//             <h6 className="line-clamp-1 mt-3 text-xs">AMOLED</h6>

//             <span className="absolute text-nowrap z-50 inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
//               <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
//               AMOLED
//             </span>
//           </div>
//           {/* <!-- Items --> */}
//           <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
//             <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
//               نرخ نوسازی
//             </h5>
//             <h6 className="line-clamp-1 mt-3 text-xs">120Hz Adaptive</h6>
//             <span className="absolute text-nowrap z-50inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
//               <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
//               120Hz Adaptive
//             </span>
//           </div>
//           {/* <!-- Items --> */}
//           <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
//             <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
//               حداکثر روشنایی
//             </h5>
//             <h6 className="line-clamp-1 mt-3 text-xs">2000 nits</h6>
//             <span className="absolute text-nowrap z-50 inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
//               <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
//               2000 nits
//             </span>
//           </div>
//           {/* <!-- Items --> */}
//           <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
//             <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
//               رزولوشن
//             </h5>
//             <h6 className="line-clamp-1 mt-3 text-xs">1290 × 2796</h6>
//             <span className="absolute text-nowrap z-50 inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
//               <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
//               1290 × 2796
//             </span>
//           </div>
//           {/* <!-- Items --> */}
//           <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
//             <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
//               نوع محافظ صفحه
//             </h5>
//             <h6 className="line-clamp-1 mt-3 text-xs">Ceramic Shield</h6>
//             <span className="absolute text-nowrap z-50 inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
//               <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
//               Ceramic Shield
//             </span>
//           </div>
//           {/* <!-- Items --> */}
//           <div className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
//             <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
//               نسبت صفحه به بدنه
//             </h5>
//             <h6 className="line-clamp-1 mt-3 text-xs">89.8%</h6>
//             <span className="absolute text-nowrap z-50 inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
//               <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
//               89.8%
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* <!-- Alert --> */}
//       <div className="rounded my-3 mx-5 lg:mx-0">
//         <div className="flex">
//           <div className="flex mt-1">
//             <i className="fas fa-circle-exclamation text-gray-500 dark:text-gray-400"></i>
//           </div>
//           <span className="ms-2 text-xs leading-6 text-justify text-neutral-500 dark:text-neutral-400">
//             امکان برگشت کالا در گروه موبایل با دلیل انصراف از خرید تنها در صورتی
//             مورد قبول است که پلمب کالا باز نشده باشد. تمام گوشی‌های دیجی‌کالا
//             ضمانت رجیستری دارند. در صورت وجود مشکل رجیستری، می‌توانید بعد از
//             مهلت قانونی ۳۰ روزه، گوشی خریداری‌شده را مرجوع کنید.
//           </span>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import React, { useState } from "react";
import { ProductDetail } from "@/src/lib/types/products/productDetail.types";

interface Props {
  product: ProductDetail;
  isOutOfStock: boolean;
}

export default function Description({ product, isOutOfStock }: Props) {
  const defaultVariant = product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];

  const colorAttributes = product.variants?.map((v) => {
    const colorAttr = v.attributes?.find((a) => a.attributeName === "رنگ");
    return {
      id: v.variantId,
      title: v.name,
      code: colorAttr?.value ?? "#ccc",
      inStock: v.inStock,
    };
  }) ?? [];

  const [selectedColor, setSelectedColor] = useState(
    colorAttributes.find((c) => c.id === defaultVariant?.variantId) ?? colorAttributes[0]
  );

  const primaryCategory = product.categories?.find((c) => c.isPrimary) ?? product.categories?.[0];
  const primaryBrand = product.brands?.find((b) => b.isPrimary) ?? product.brands?.[0];

  return (
    <section className="xl:col-span-5 mt-7 col-span-12 pb-10 w-full dark:text-gray-200">
      {/* Category */}
      <ul className="space-x-2 flex items-center">
        {primaryBrand && (
          <>
            <li>
              <a href={`/brand/${primaryBrand.slug}`} className="text-primary">
                {primaryBrand.name}
              </a>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
          </>
        )}
        {primaryCategory && (
          <li>
            <a href={`/category/${primaryCategory.slug}`} className="text-primary">
              {primaryCategory.name}
            </a>
          </li>
        )}
      </ul>

      {/* Title */}
      <div className="space-y-2 mt-2 pb-2 border-b border-b-gray-300 dark:border-b-gray-700">
        <h2 className="font-black leading-8">{product.name}</h2>
        {product.shortDescription && (
          <h2 className="text-gray-400 dark:text-gray-500 text-sm leading-8">
            {product.shortDescription}
          </h2>
        )}
      </div>

      {/* Rating, Comments */}
      <div className="flex flex-wrap items-center pt-2 mt-2 space-x-2">
        <div className="flex items-center space-x-1">
          <i className="fas fa-star text-amber-400"></i>
          <h4 className="text-sm font-bold">{product.averageRating?.toFixed(1) ?? "0.0"}</h4>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            (امتیاز {new Intl.NumberFormat("fa-IR").format(product.reviewCount ?? 0)} خریدار)
          </span>
        </div>

        <div>
          
            <a href="#comments" className="bg-gray-200 hover:bg-primary/20 transition dark:bg-zinc-800 dark:text-gray-200 px-2 py-1 space-x-1 rounded-full flex items-center">
            <span className="text-xs">
              {new Intl.NumberFormat("fa-IR").format(product.reviewCount ?? 0)} دیدگاه
            </span>
            <i className="far fa-angle-left"></i>
          </a>
        </div>
      </div>

      {/* Out of Stock Notice */}
      {isOutOfStock && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <i className="far fa-exclamation-triangle text-red-500"></i>
            <span className="text-red-700 dark:text-red-300 font-medium">
              این محصول در حال حاضر موجود نمی‌باشد
            </span>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            می‌توانید از طریق دکمه زیر، در صورت موجود شدن به شما اطلاع‌رسانی کنیم.
          </p>
        </div>
      )}

      {/* Color Picker */}
      {colorAttributes.length > 0 && selectedColor && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border"
              style={{ background: selectedColor.code }}
            />
            <p className="font-semibold text-lg">رنگ: {selectedColor.title}</p>
          </div>

          <div className="flex items-center gap-4">
            {colorAttributes.slice(0, 4).map((color) => {
              const isActive = selectedColor?.id === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => !isOutOfStock && setSelectedColor(color)}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center"
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full ring-4 ring-sky-400" />
                  )}
                  <span
                    className="relative z-10 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    style={{ background: color.code }}
                  >
                    {isActive && (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Attributes */}
      {product.variants?.[0]?.attributes?.length > 0 && (
        <div className="mt-8 space-y-3">
          <h4 className="font-bold text-lg">ویژگی‌ها</h4>
          <div className="grid gap-3 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {product.variants[0].attributes.map((attr) => (
              <div key={attr.attributeId} className="p-3 bg-gray-200 dark:bg-zinc-800 rounded-lg relative group">
                <h5 className="line-clamp-1 text-xs text-gray-600 dark:text-gray-300">
                  {attr.attributeName}
                </h5>
                <h6 className="line-clamp-1 mt-3 text-xs">{attr.value}</h6>
                <span className="absolute text-nowrap z-50 inset-e-1/2 ms-2 -top-3 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded-md shadow-lg">
                  <span className="absolute inset-e-1/2 -bottom-2.5 rotate-90 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-e-4 border-e-gray-900"></span>
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warranty / Alert */}
      {product.warrantyInfo && (
        <div className="rounded my-3 mx-5 lg:mx-0">
          <div className="flex">
            <div className="flex mt-1">
              <i className="fas fa-circle-exclamation text-gray-500 dark:text-gray-400"></i>
            </div>
            <span className="ms-2 text-xs leading-6 text-justify text-neutral-500 dark:text-neutral-400">
              {product.warrantyInfo}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}