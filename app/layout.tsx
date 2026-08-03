
import type { Metadata, Viewport } from "next";

import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";
import NavMobile from "@/components/layout/NavMobile/NavMobile";
import "./globals.css";
import { BackToTopButton } from "@/components/modules/BackToTopButton/BackToTopButton";
import ToastProvider from "@/components/modules/providers/ToastProvider";
import { SerwistProvider } from "@/components/modules/providers/SerwistProvider";
import { CartProvider } from "@/src/context/CartContext";
import AuthInitializer from "@/components/modules/AuthInitializer/AuthInitializer";
import { SITE_NAME, SITE_URL } from "@/src/lib/seo/site";
import StoryMiniPlayer from "@/components/ui/Home/Story/StoryMiniPlayer";



export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "فروشگاه اینترنتی کارآپ 24 — خرید آنلاین با بهترین قیمت",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ee384e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={` h-full antialiased`}
    >
      <body className="relative bg-custom-light dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <SerwistProvider swUrl="/serwist/sw.js">
          <CartProvider>
            <AuthInitializer />
            <Header />
            {children}
            <Footer />
            <NavMobile />
            <BackToTopButton />
            <StoryMiniPlayer />
            <ToastProvider />
          </CartProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
