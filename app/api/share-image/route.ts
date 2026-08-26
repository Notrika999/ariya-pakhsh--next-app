const ALLOWED_IMAGE_HOSTS = new Set(["aryapakhsh.shop"]);
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const imageUrlParam = requestUrl.searchParams.get("url");

  if (!imageUrlParam) {
    return new Response("Missing image url", { status: 400 });
  }

  let imageUrl: URL;
  try {
    imageUrl = new URL(imageUrlParam);
  } catch {
    return new Response("Invalid image url", { status: 400 });
  }

  if (
    imageUrl.protocol !== "https:" ||
    !ALLOWED_IMAGE_HOSTS.has(imageUrl.hostname)
  ) {
    return new Response("Image host is not allowed", { status: 403 });
  }

  const imageResponse = await fetch(imageUrl, {
    headers: {
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    },
    next: { revalidate: 3600 },
  });

  if (!imageResponse.ok) {
    return new Response("Image request failed", { status: 502 });
  }

  const contentType = imageResponse.headers.get("content-type") ?? "";
  const contentLength = Number(imageResponse.headers.get("content-length"));

  if (!contentType.startsWith("image/")) {
    return new Response("Response is not an image", { status: 415 });
  }

  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
    return new Response("Image is too large", { status: 413 });
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  if (imageBuffer.byteLength > MAX_IMAGE_BYTES) {
    return new Response("Image is too large", { status: 413 });
  }

  return new Response(imageBuffer, {
    headers: {
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
      "content-type": contentType,
    },
  });
}
