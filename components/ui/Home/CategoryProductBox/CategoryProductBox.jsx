import SectionHeader from "@/components/modules/SectionHeader/SectionHeader";
import Image from "next/image";
import Link from "next/link";

export default function CategoryProductBox({ productsLast, title, href }) {
  return (
    <>
      <h2 className="sr-only">آخرین مشاهدات کاربر</h2>

      {/* <!-- header --> */}
      <SectionHeader title={title} href={href} />

      {/* <!--items--> */}
      <div className="grid grid-cols-12 gap-4 place-items-center">
        {/* <!-- CATEGORY BOX 2 --> */}
        {productsLast.map((products) => (
          <section
            key={products.id}
            className="lg:col-span-6 xl:col-span-4 col-span-12 w-full bg-white dark:bg-custom-dark rounded-2xl p-1 drop-shadow dark:shadow-[0_0_15px_rgba(0,0,0,0.6)]"
          >
            <header className="col-span-2 w-full p-3">
              <div className="flex items-center justify-between">
                <div className="text-start space-y-1">
                  <h3 className="font-bold text-lg with-highlight dark:text-gray-200">
                    {products.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    بر اساس سلیقه شما
                  </p>
                </div>
                <a
                  href="#"
                  className="text-xs font-medium bg-primary text-white py-1.5 px-4 rounded-lg hover:bg-primary/90 active:scale-95 transition duration-200 shadow-sm hover:shadow dark:bg-primary/80 dark:hover:bg-primary/60 dark:text-white"
                >
                  بیشتر
                </a>
              </div>
            </header>

            <div className="grid grid-cols-2 place-items-center product-group-item">
              {/* <!-- small product card 1 --> */}
              {products.offerProducts.map((product) => (
                <div
                  key={product.id}
                  className="col-span-1 dark:border-gray-800 group relative flex items-center justify-center h-60 text-center w-full bg-white p-3 py-4 dark:bg-custom-dark"
                >
                  <div className="relative transition-all duration-200 ease-in-out group">
                    {/* <!-- Product Colors --> */}
                    <ul className="absolute top-4 inset-s-3 space-y-1">
                      <li
                        className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: "rgb(248, 162, 3)" }}
                      ></li>
                      <li
                        className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: "rgb(255, 232, 145)" }}
                      ></li>
                    </ul>

                    {/* <!-- Thumbnail --> */}
                    <div className="text-center flex items-center justify-center overflow-hidden">
                      <Image
                        width={120}
                        height={120}
                        src={product.image ?? "/images/default.png"}
                        alt={product.title}
                        loading="lazy"
                        className="block h-30 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* <!-- Discount Badge --> */}
                    <div className="absolute inset-e-3 top-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-xl rounded-bl-md shadow shadow-red-500/50 z-10">
                      {product.discount}%
                    </div>

                    {/* <!-- Product Body --> */}
                    <div className="mt-3">
                      <h3 className="font-normal text-xs leading-6 line-clamp-1 mt-2 px-1 overflow-hidden group-hover:text-primary-600 dark:group-hover:text-primary-400 dark:text-gray-200 text-gray-900 transition-colors duration-200">
                        <Link href={product.href} className="font-bold">
                          {product.title}
                        </Link>
                      </h3>
                    </div>

                    {/* <!-- Price + Rating --> */}
                    <div className="mt-2 flex justify-between items-end">
                      {/* <!-- Rating --> */}
                      <div className="flex flex-row items-end mt-2">
                        <span className="font-bold flex items-center text-xs text-gray-900 dark:text-gray-200 ms-1 mb-1">
                          {product.rating}
                          <span className="text-amber-400 text-xs ms-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="m12 16.3l-3.7 2.825q-.275.225-.6.213t-.575-.188t-.387-.475t-.013-.65L8.15 13.4l-3.625-2.575q-.3-.2-.375-.525t.025-.6t.35-.488t.6-.212H9.6l1.45-4.8q.125-.35.388-.538T12 3.475t.563.188t.387.537L14.4 9h4.475q.35 0 .6.213t.35.487t.025.6t-.375.525L15.85 13.4l1.425 4.625q.125.35-.012.65t-.388.475t-.575.188t-.6-.213z"
                              />
                            </svg>
                          </span>
                        </span>
                      </div>

                      {/* <!-- Price --> */}
                      <div className="flex flex-col justify-end min-h-10 h-10">
                        <span className="text-xs text-gray-400 dark:text-gray-500 line-through tracking-wider text-left">
                          {product.oldPrice} تومان
                        </span>
                        <span className="font-bold text-sm text-gray-900 dark:text-gray-200 tracking-wider text-left">
                          {product.price} تومان
                        </span>
                      </div>
                    </div>

                    <Link
                      className="absolute inset-0 w-full h-full"
                      href={product.href}
                    ></Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
