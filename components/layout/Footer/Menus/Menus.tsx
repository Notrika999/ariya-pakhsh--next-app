// components/layout/Footer/Menus/Menus
import React from "react";
import footerStyles from "../Footer.module.css";
import MenuItems from "./MenuItems";
import SocialMediaItem from "./SocialMediaItem";
import Image from "next/image";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";

export default function Menus() {
  const footerMenus = [
    {
      id: 1,
      title: "راهنمای خرید از<strong> کارآپ 24</strong>",
      subMenus: [
        { id: 1, title: "نحوه ثبت سفارش", link: "#", new: false },
        { id: 2, title: "چگونگی ارسال کالا", link: "#", new: false },
        { id: 3, title: "چگونگی پرداخت", link: "#", new: false },
        { id: 4, title: "چگونگی ثبت", link: "#", new: false },
      ],
    },
    {
      id: 2,
      title: "<strong> خدمت </strong>مشتریان",
      subMenus: [
        { id: 1, title: "پاسخ به پرسش‌های متداول", link: "/faq", new: false },
        { id: 2, title: "رویه‌های بازگرداندن کالا", link: "#", new: false },
        { id: 3, title: "قوانین و مقررات", link: "/rules", new: false },
        { id: 4, title: "حریم خصوصی", link: "/privacy-policy", new: false },
      ],
    },
    {
      id: 3,
      title: "با <strong> کارآپ 24</strong>",
      subMenus: [
        { id: 1, title: "اتاق خبر", link: "#", new: false },
        { id: 2, title: "تماس با ما", link: "/contact", new: false },
        { id: 3, title: "درباره ما", link: "/about", new: false },
      ],
    },
    // {
    //   id: 4,
    //   title: "<strong> نقشه </strong>استادینو",
    //   subMenus: [
    //     { id: 1, title: "درباره ما", link: "/about", new: false },
    //     { id: 2, title: "تماس با ما", link: "/contact", new: false },
    //     { id: 3, title: "همکاری و فرصت شغلی", link: "#", new: false },
    //     { id: 4, title: "شعب گاج", link: "#", new: true },
    //   ],
    // },
  ];

  const socialMedia = [
    { id: 1, src: "/images/social/aparat-white.svg", link: "#" },
    {
      id: 2,
      src: "/images/social/instagram-1-svgrepo-com.svg",
      link: "https://www.instagram.com/carup24.ir",
    },
    { id: 3, src: "/images/social/telegram-svgrepo-com.svg", link: "#" },
    { id: 4, src: "/images/social/youtube-svgrepo-com.svg", link: "#" },
  ];
  return (
    <div className="py-8 bg-gray-200/50 dark:bg-[#0d1117] transition-colors duration-300">
      <SectionContainer>
        <div className="w-full px-4">
          <div className="flex flex-wrap gap-y-6">
            {/* <!--Footer Menus Section--> */}
            <div className="w-full xl:w-6/12">
              <div className="flex flex-wrap gap-y-3">
                {/* <!--Guide Menu--> */}
                {footerMenus.map((menu) => (
                  <MenuItems
                    key={menu.id}
                    parentTitle={menu.title}
                    subMenus={menu.subMenus}
                  />
                ))}
              </div>
            </div>

            {/* <!--Second column: Contact and symbols--> */}
            <div className="w-full xl:w-6/12">
              <div className="flex flex-wrap">
                {/* <!--Contact section--> */}
                <div className="w-full sm:w-5/12">
                  <div className="bg-primary-500 text-sm hover:bg-primary-600 p-2 rounded-lg text-center font-semibold text-white transition-colors">
                    کارشناسان ما میزبان صدایتان هستند
                  </div>
                  <div className="flex items-center justify-end mt-2 py-2">
                    <a
                      href=""
                      className="ms-2 text-gray-800 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400 transition-colors"
                    >
                      90007824
                    </a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 ms-1 text-gray-800 dark:text-gray-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </div>
                </div>

                {/* <!--Symbols and social networks section--> */}
                <div className="w-full sm:w-7/12">
                  <nav className="flex justify-center pt-0 mt-0">
                    <div className="flex">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `<a referrerpolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=727850&Code=rTy1Yd0Sqod6bkxyiAmHJ2KRfISanirx"><img referrerpolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=727850&Code=rTy1Yd0Sqod6bkxyiAmHJ2KRfISanirx" alt="" style="cursor:pointer" code="rTy1Yd0Sqod6bkxyiAmHJ2KRfISanirx"></a>`,
                        }}
                      />

                      {/* <a
                        referrerpolicy="origin"
                        target="_blank"
                        href="https://trustseal.enamad.ir/?id=727850&Code=rTy1Yd0Sqod6bkxyiAmHJ2KRfISanirx"
                      >
                        <img
                          referrerpolicy="origin"
                          src="https://trustseal.enamad.ir/logo.aspx?id=727850&Code=rTy1Yd0Sqod6bkxyiAmHJ2KRfISanirx"
                          alt=""
                          style="cursor:pointer"
                          code="rTy1Yd0Sqod6bkxyiAmHJ2KRfISanirx"
                        />
                      </a> */}
                    </div>
                  </nav>

                  {/* <!--Social networks--> */}
                  <div className="mt-4">
                    <nav className="flex justify-center">
                      <div className="flex">
                        {socialMedia.map((social) => (
                          <SocialMediaItem
                            key={social.id}
                            image={social.src}
                            link={social.link}
                          />
                        ))}
                      </div>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            {/* <!--Logo and description section--> */}
            <div className="w-full mt-8">
              <div className="flex flex-wrap">
                {/* <!--Logo--> */}
                <div className="w-full lg:block hidden lg:w-2/12 relative">
                  <div className="relative w-56 ">
                    <div
                      className={`absolute -inset-3 inset-e-0 md:top-11 top-4 h-24 w-64 dark:hidden dark:opacity-70 ${footerStyles.footerLogoShadow}`}
                    ></div>
                    <a
                      href="#"
                      className="absolute 
                       inset-s-2 inset-e-0 text-center dark:mt-0 md:mt-19 mt-10 block "
                    >
                      <Image
                        width={60}
                        height={60}
                        src="/images/logo/carup24-logo.png"
                        className=" mt-2 inline-block mx-auto dark:invert"
                        alt="کارآپ ۲۴"
                      />
                    </a>
                  </div>
                </div>
                {/* <!--Description--> */}
                <div className="w-full lg:w-10/12">
                  <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
                    <small className="text-gray-500 text-xs dark:text-gray-400">
                      کارآپ 24؛ مرجع تخصصی عرضه و پخش لوازم لوکس و جانبی خودرو
                      شامل هدلایت‌های حرفه‌ای، انواع کفپوش‌های سه‌بعدی و
                      پنج‌بعدی، روکش صندلی و تجهیزات تزئینی و ارتقایی کابین
                      خودرو است. این مجموعه با تمرکز بر کیفیت و تنوع محصولات،
                      امکان انتخاب و تهیه لوازم مدرن و کاربردی را برای ارتقای
                      ظاهر و راحتی خودرو فراهم می‌کند و تلاش دارد تجربه‌ای ساده،
                      سریع و مطمئن در خرید لوازم لوکس خودرو ارائه دهد.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
