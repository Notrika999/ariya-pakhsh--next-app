export function resolveStoryHref(link) {
  if (!link) return null;

  const type = String(link.type ?? "").toLowerCase();
  const targetId = link.targetId ? encodeURIComponent(link.targetId) : null;

  if (link.href) return link.href;
  if (link.url) return link.url;
  if (type === "product" && targetId) return `/product/${targetId}`;
  if (type === "category" && targetId) return `/products/${targetId}`;
  if (type === "landing" && targetId) return `/landing/${targetId}`;
  if (type === "campaign" && targetId) {
    return `/incredible-offers?campaignId=${targetId}`;
  }
  if (link.filterPayload) {
    return `/products?filterPayload=${encodeURIComponent(link.filterPayload)}`;
  }

  return null;
}

export function getStoryActionText(story, link) {
  if (story?.ctaText) return story.ctaText;

  const type = String(link?.type ?? "").toLowerCase();
  if (type === "product") return "مشاهده محصول";
  if (type === "category") return "مشاهده دسته‌بندی";
  if (type === "campaign") return "مشاهده پیشنهاد";

  return "مشاهده";
}

export function disableNativePictureInPicture(video) {
  if (!video) return;

  video.setAttribute("disablepictureinpicture", "");
  video.setAttribute(
    "controlslist",
    "nodownload nofullscreen noremoteplayback noplaybackrate",
  );

  if ("disablePictureInPicture" in video) {
    video.disablePictureInPicture = true;
  }

  if ("disableRemotePlayback" in video) {
    video.disableRemotePlayback = true;
  }
}
