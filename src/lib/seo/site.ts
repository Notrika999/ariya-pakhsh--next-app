/** دامنه عمومی سایت (برای canonical، sitemap، OG — نه API/swagger) */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aryapakhsh.shop"
).replace(/\/$/, "");

export const SITE_NAME = "آریاپخش";

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
