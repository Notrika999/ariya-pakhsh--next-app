import Link from "next/link";
import React from "react";

export default function ProductCard({ product }) {
  console.log(product.href);
  return (
    <div className="relative dark:border-gray-700 dark:shadow-[0_0_10px_rgba(0,0,0,0.6)] rounded p-3 bg-white dark:bg-custom-dark transition-all duration-200 ease-in-out group">
      {/* Product Colors */}
      <ul className="absolute top-4 start-3 space-y-1">
        {product.colors?.map((color, idx) => (
          <li
            key={idx}
            className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: color }}
          ></li>
        ))}
      </ul>

      {/* Thumbnail */}
      <div className="text-center flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="block h-40 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Discount Badge */}
      <div className="absolute end-3 top-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10">
        {product.discount}%
      </div>

      {/* Product Body */}
      <div className="mt-3">
        <h3 className="font-normal text-sm leading-6 max-h-12 min-h-12 mt-2 px-1 overflow-hidden group-hover:text-primary-600 dark:group-hover:text-primary-400 dark:text-gray-200 text-gray-900 transition-colors duration-200">
          <a href={product.href} className="font-bold">
            {product.title}
          </a>
        </h3>
      </div>

      {/* Price + Rating */}
      <div className="mt-2 flex justify-between items-end">
        <div className="flex flex-row items-end mt-2">
          <span className="font-bold flex items-center text-xs text-gray-900 dark:text-gray-200 ms-1 mb-1">
            {product.rating}
            <span className="text-amber-400 text-xs ms-1">★</span>
          </span>
        </div>
        <div className="flex flex-col justify-end min-h-10 h-10">
          <span className="text-xs text-gray-400 dark:text-gray-500 line-through tracking-wider text-left">
            {product.oldPrice}
          </span>
          <span className="font-bold text-sm text-gray-900 dark:text-gray-200 tracking-wider text-left">
            {product.price}
          </span>
        </div>
      </div>
      <Link
        className="absolute inset-0 w-full h-full"
        href={`${product.href}/${product.id}`}
      ></Link>
    </div>
  );
}
