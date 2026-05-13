import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function OurTeam() {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          تیم ما
        </span>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          با اعضای تیم ما آشنا شوید
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
          تیمی متشکل از متخصصان باانگیزه و متعهد که پشت موفقیت‌های ما قرار دارند
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300 group">
          <div className="overflow-hidden">
            <Image
              width={100}
              height={100}
              src="/images/about/3.jpg"
              alt="سارا محمدی"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div className="p-6 text-center">
            <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">
              سارا محمدی
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">مدیر فروش</p>
            <div className="flex justify-center space-x-3 ">
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition"
              >
                <i className="fab fa-twitter text-xl"></i>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300 group">
          <div className="overflow-hidden">
            <Image
              width={100}
              height={100}
              src="/images/about/1.jpg"
              alt="علی رضایی"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div className="p-6 text-center">
            <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">
              علی رضایی
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              توسعه دهنده ارشد
            </p>
            <div className="flex justify-center space-x-3 ">
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition"
              >
                <i className="fab fa-twitter text-xl"></i>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300 group">
          <div className="overflow-hidden">
            <Image
              width={100}
              height={100}
              src="/images/about/4.jpg"
              alt="نرگس حسینی"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div className="p-6 text-center">
            <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">
              نرگس حسینی
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">طراح UI/UX</p>
            <div className="flex justify-center space-x-3 ">
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition"
              >
                <i className="fab fa-twitter text-xl"></i>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300 group">
          <div className="overflow-hidden">
            <Image
              width={100}
              height={100}
              src="/images/about/2.jpg"
              alt="محمد جوادی"
              className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
          <div className="p-6 text-center">
            <h3 className="font-bold text-xl mb-1 text-gray-900 dark:text-white">
              محمد جوادی
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              مدیر پشتیبانی
            </p>
            <div className="flex justify-center space-x-3 ">
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition"
              >
                <i className="fab fa-twitter text-xl"></i>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-primary transition"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
