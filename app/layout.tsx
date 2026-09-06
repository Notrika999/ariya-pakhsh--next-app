
/* eslint-disable @next/next/next-script-for-ga -- GTM must be emitted literally in the document head. */
import type { Metadata, Viewport } from "next";

import "./globals.css";
import ToastProvider from "@/components/modules/providers/ToastProvider";
import { SerwistProvider } from "@/components/modules/providers/SerwistProvider";
import { CartProvider } from "@/src/context/CartContext";
import AuthInitializer from "@/components/modules/AuthInitializer/AuthInitializer";
import StoreChrome from "@/components/layout/StoreChrome";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_URL,
} from "@/src/lib/seo/site";



export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} | CarUp24`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
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
  themeColor: SITE_THEME_COLOR,
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
      <head>
        <script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PCKZHNRK');`,
          }}
        />
      </head>
      <body className="relative bg-custom-light dark:bg-[#0d1117] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PCKZHNRK"
            height="0"
            width="0"
            className="hidden invisible"
            title="Google Tag Manager"
          />
        </noscript>
        <SerwistProvider swUrl="/serwist/sw.js">
          <CartProvider>
            <AuthInitializer />
            <StoreChrome>{children}</StoreChrome>
            <ToastProvider />
          </CartProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
