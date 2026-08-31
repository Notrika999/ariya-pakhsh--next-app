/** دامنه عمومی سایت (برای canonical، sitemap، OG — نه API/swagger) */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://carup24.com"
).replace(/\/+$/, "");

export const SITE_NAME = "کارآپ 24";
export const SITE_DESCRIPTION =
  "فروشگاه تخصصی لوازم لوکس و جانبی خودرو؛ خرید آنلاین با ضمانت اصالت کالا";
export const SITE_THEME_COLOR = "#e75c2d";
export const SITE_BACKGROUND_COLOR = "#fcfeff";

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
