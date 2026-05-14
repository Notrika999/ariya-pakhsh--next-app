import Link from "next/link";

export default function NavMobile() {
  return (
    //    <!-- NAV MOBILE -->
    <nav className="fixed lg:hidden block bottom-0 inset-e-0 inset-s-0 z-30 py-2 px-2 rounded-t-[30px] overflow-hidden bg-custom-light dark:bg-custom-dark before:content-[''] before:absolute before:top-0 before:right-0 before:w-full before:h-full before:opacity-30">
      <div className="flex justify-around items-baseline relative text-white dark:text-gray-100">
        {/* <!-- Home --> */}
        <Link
          href="/"
          className="flex flex-col items-center px-2 py-3 rounded-[15px] transition-all duration-300 relative"
        >
          <div className="w-12.5 h-12.5 flex items-center justify-center rounded-full mb-1 bg-primary dark:bg-[rgba(255,255,255,0.05)] transition-all duration-300">
            <i className="far fa-home text-xl"></i>
          </div>
        </Link>

        {/* <!-- Search --> */}
        <Link
          href="#"
          className="flex flex-col items-center px-2 py-3 rounded-[15px] transition-all duration-300 relative"
        >
          <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full mb-1 bg-primary dark:bg-[rgba(255,255,255,0.05)] transition-all duration-300">
            <i className="far fa-search"></i>
          </div>
        </Link>

        {/* <!--Central button--> */}
        {/* <div className="flex flex-col items-center relative">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-[70px] h-[70px] bg-[linear-gradient(135deg,#D4AF37_0%,#F1C40F_100%)] dark:bg-[linear-gradient(135deg,#FFD700_0%,#B8860B_100%)] text-white rounded-full border-4 border-white/80 dark:border-gray-800 flex items-center justify-center mt-[-35px] shadow-[0_5px_20px_rgba(212,175,55,0.5)] active:scale-95 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 18V8.8l-3.6 3.6L6 11l6-6l6 6l-1.4 1.4L13 8.8V18z"
              />
            </svg>
          </button>
        </div> */}

        {/* <!--Shopping Cart--> */}
        <Link
          href="/cart"
          className="flex flex-col items-center px-2 py-3 rounded-[15px] transition-all duration-300 relative"
        >
          <div className="w-12.5 h-12.5 flex items-center justify-center rounded-full mb-1 bg-primary dark:bg-[rgba(255,255,255,0.05)] relative">
            <i className="fas fa-shopping-bag text-xl"></i>
            <span className="absolute top-[5px] end-[5px] bg-secondary text-white w-[20px] h-[20px] text-[12px] font-bold flex items-center justify-center rounded-full">
              ۳
            </span>
          </div>
        </Link>

        {/* <!-- Profile --> */}
        <Link
          href="user-profile"
          className="flex flex-col items-center px-2 py-3 rounded-[15px] transition-all duration-300 relative"
        >
          <div className="w-12.5 h-12.5 flex items-center justify-center rounded-full mb-1 bg-primary dark:bg-[rgba(255,255,255,0.05)] transition-all duration-300">
            <i className="far fa-user text-xl"></i>
          </div>
        </Link>
      </div>
    </nav>
    // <!-- END MODAL LOGIN -->
  );
}
