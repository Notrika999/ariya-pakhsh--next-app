import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
import { SectionContainer } from "@/components/modules/SectionContainer/SectionContainer";
import type {
  LegalBlock,
  LegalDocumentData,
  LegalInline,
} from "@/src/lib/legal/parse-legal-markdown";

function InlineText({ parts }: { parts: LegalInline[] }) {
  return parts.map((part, index) => {
    if (part.type === "strong") {
      return (
        <strong key={index} className="font-semibold text-gray-800 dark:text-gray-100">
          {part.value}
        </strong>
      );
    }
    if (part.type === "code") {
      return (
        <code
          key={index}
          className="rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800"
          dir="ltr"
        >
          {part.value}
        </code>
      );
    }
    return <span key={index}>{part.value}</span>;
  });
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return blocks.map((block, index) => {
    if (block.type === "h3") {
      return (
        <h3
          key={index}
          className="mt-6 mb-3 text-lg font-bold text-gray-800 dark:text-gray-100"
        >
          <InlineText parts={block.parts} />
        </h3>
      );
    }

    if (block.type === "ul") {
      return (
        <ul
          key={index}
          className="my-3 list-disc space-y-1 pr-5 text-gray-600 dark:text-gray-400"
        >
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <InlineText parts={item} />
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="mb-4 leading-8 text-gray-600 dark:text-gray-400">
        <InlineText parts={block.parts} />
      </p>
    );
  });
}

export default function LegalDocument({ doc }: { doc: LegalDocumentData }) {
  return (
    <SectionContainer>
      <div className="mb-12 text-center">
        <TitleAfter tag title={doc.title} />
        {doc.lastUpdated && (
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <span>{doc.lastUpdated}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark">
            <TitleAfter title={"فهرست مطالب"} />
            <nav className="space-y-2">
              {doc.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark sm:p-8">
            {doc.intro.length > 0 && (
              <div className="mb-8">
                <Blocks blocks={doc.intro} />
              </div>
            )}

            {doc.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-10 scroll-mt-24">
                <TitleAfter title={section.title} />
                <Blocks blocks={section.blocks} />
              </section>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
