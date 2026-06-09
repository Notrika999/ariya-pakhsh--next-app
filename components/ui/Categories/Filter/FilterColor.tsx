// import React from "react";

// export default function FilterColor() {
//   return (
//     <section>
//       <div className="dark:bg-custom-dark dark:border-gray-700 dark:text-white bg-white rounded-lg drop-shadow-lg border-gray-300 border p-4">
//         <h2 className="font-bold text-base mb-4 relative pb-4 before:absolute before:inset-s-0 before:bottom-0 before:size-2 before:rounded-full before:bg-primary after:absolute after:w-40 after:h-2 after:bottom-0 after:inset-s-4 after:bg-primary after:rounded-lg">
//           رنگ ها
//         </h2>
//         <div className="relative space-x-2 flex-wrap flex items-center w-full">
//           <div className="flex items-center">
//             <input
//               type="radio"
//               name="color"
//               id="greenColor"
//               className="hidden peer"
//             />
//             <label
//               htmlFor="greenColor"
//               className="select-none dark:text-white! cursor-pointer flex items-center justify-center rounded-full border-2 border-gray-200 py-1 px-3 text-gray-700 transition-colors duration-200 ease-in-out peer-checked:text-gray-900 peer-checked:border-primary-500"
//             >
//               <span className="size-4 bg-green-600 rounded-full"></span>
//               <span className="dir-ltr ms-2 text-sm">سبز</span>
//             </label>
//           </div>
//           <div className="flex items-center">
//             <input
//               type="radio"
//               name="color"
//               id="blueColor"
//               className="hidden peer"
//             />
//             <label
//               htmlFor="blueColor"
//               className="select-none dark:text-white! cursor-pointer flex items-center justify-center rounded-full border-2 border-gray-200 py-1 px-3 text-gray-700 transition-colors duration-200 ease-in-out peer-checked:text-gray-900 peer-checked:border-primary-500"
//             >
//               <span className="size-4 bg-blue-600 rounded-full"></span>
//               <span className="dir-ltr ms-2 text-sm">ابی</span>
//             </label>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ColorOption = {
  optionId: string;
  value: string;
  count: number;
};

type Props = {
  options: ColorOption[];
};

export default function FilterColor({ options }: Props) {
  console.log("OPTIONS IN COMPONENT:", options);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedColor = searchParams.get("color");

  const handleChange = (optionId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("color", optionId);
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <section>
      <div className="bg-white rounded-lg border p-4">
        <h2>رنگ ها</h2>

        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <div key={option.optionId}>
              <input
                type="radio"
                id={option.optionId}
                name="color"
                checked={selectedColor === option.optionId}
                onChange={() => handleChange(option.optionId)}
              />

              <label htmlFor={option.optionId}>
                <span>{option.value}</span>
                <span>({option.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}