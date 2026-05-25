import { DescriptionSectionType } from "@/src/lib/types/landing/landing.types";

export default function DescriptionSection({
  title,
  text,
}: DescriptionSectionType) {
  
  
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-6">
         {title}
        </h2>
        <p className="text-gray-600 leading-8">
          {text}
        </p>
      </div>
    </section>
  );
}
