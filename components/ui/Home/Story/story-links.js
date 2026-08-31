import { resolveLandingHref } from "@/components/ui/landing/landingConfigs";

export function isUsableStoryLink(link) {
  if (!link || typeof link !== "object") return false;

  return Boolean(
    link.href ||
      link.url ||
      String(link.targetId ?? "").trim() ||
      link.filterPayload ||
      String(link.type ?? "").trim(),
  );
}

export function getStoryActionLink(frame, story) {
  if (isUsableStoryLink(frame?.link)) return frame.link;
  if (isUsableStoryLink(story?.link)) return story.link;
  return null;
}

export function resolveStoryHref(link) {
  if (!link) return null;

  const type = String(link.type ?? "").toLowerCase();
  const rawTargetId = String(link.targetId ?? "").trim();
  const targetId = rawTargetId ? encodeURIComponent(rawTargetId) : null;

  if (link.href) return link.href;
  if (link.url) return link.url;
  if (type === "product" && targetId) return `/product/${targetId}`;
  if (type === "category" && targetId) {
    return `/products?categoryId=${targetId}`;
  }
  if (type === "brand" && targetId) return `/products?brandId=${targetId}`;
  if (type === "landing") return resolveLandingHref(rawTargetId);
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
  if (type === "brand") return "مشاهده برند";
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
