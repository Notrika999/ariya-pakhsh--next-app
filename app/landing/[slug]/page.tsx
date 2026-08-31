import { landingConfigs } from "@/components/ui/landing/landingConfigs";
import LandingRenderer from "@/components/ui/landing/LandingRenderer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;

  const config = landingConfigs[slug];

  if (!config) {
    notFound();
  }
  return (
    <main>
      <LandingRenderer sections={config.sections} />
    </main>
  );
}
