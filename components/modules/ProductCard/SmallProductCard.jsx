import Image from "next/image";
import Link from "next/link";

export default function SmallProductCard({ product }) {
  return (
    <div className="col-span-1 group relative flex h-60 w-full items-center justify-center bg-white p-3 py-4 text-center dark:bg-custom-dark">
      <div className="relative transition-all duration-200 ease-in-out">

        {/* colors */}
        <ul className="absolute top-4 start-3 space-y-1">
          {product.colors?.map((color, i) => (
            <li
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: color }}
            />
          ))}
        </ul>

        {/* image */}
        <div className="flex items-center justify-center overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            width={120}
            height={120}
            className="block h-28 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* discount */}
        <div className="absolute end-3 top-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-xl rounded-bl-md shadow z-10">
          {product.discount}%
        </div>

        {/* title */}
        <div className="mt-3">
          <h3 className="text-xs leading-6 line-clamp-1 mt-2 px-1 overflow-hidden group-hover:text-primary-600 dark:group-hover:text-primary-400 dark:text-gray-200 text-gray-900 transition-colors duration-200">
            <Link href={product.href} className="font-bold">
              {product.title}
            </Link>
          </h3>
        </div>

        {/* rating + price */}
        <div className="mt-2 flex justify-between items-end">

          <div className="flex items-center text-xs font-bold text-gray-900 dark:text-gray-200">
            {product.rating}
            <span className="text-amber-400 ms-1">★</span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs text-gray-400 line-through">
              {product.oldPrice}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-200">
              {product.price}
            </span>
          </div>

        </div>

        <Link href={`${product.href}/${product.id}`} className="absolute inset-0" />
      </div>
    </div>
  );
}
