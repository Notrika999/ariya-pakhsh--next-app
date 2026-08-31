import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(`/mag/${encodeURIComponent(slug)}`);
}
