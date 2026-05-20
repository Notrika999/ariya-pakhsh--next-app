// // app/landing/[slug]/page.tsx

import { landingConfigs } from "@/components/ui/landing/landingConfigs";
import LandingRenderer from "@/components/ui/landing/LandingRenderer";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const config = landingConfigs[slug];

  if (!config) {
    return <div>not found</div>;
  }
  return (
    <main>
      <LandingRenderer sections={config.sections} />
    </main>
  );
}
