export type LegalInline =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "code"; value: string };

export type LegalBlock =
  | { type: "p"; parts: LegalInline[] }
  | { type: "h3"; parts: LegalInline[] }
  | { type: "ul"; items: LegalInline[][] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocumentData = {
  title: string;
  lastUpdated?: string;
  intro: LegalBlock[];
  sections: LegalSection[];
};

export function parseInline(text: string): LegalInline[] {
  const parts: LegalInline[] = [];
  const pattern = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1] != null) {
      parts.push({ type: "strong", value: match[1] });
    } else {
      parts.push({ type: "code", value: match[2] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

function slugifyHeading(title: string, index: number) {
  const numbered = title.match(/^(\d+|[۰-۹]+)/);
  if (numbered) return `section-${numbered[1]}`;
  return `section-${index + 1}`;
}

function flushParagraph(
  buffer: string[],
  target: LegalBlock[],
) {
  const text = buffer.join(" ").trim();
  buffer.length = 0;
  if (!text) return;
  target.push({ type: "p", parts: parseInline(text) });
}

function flushList(items: string[], target: LegalBlock[]) {
  if (items.length === 0) return;
  target.push({
    type: "ul",
    items: items.map((item) => parseInline(item)),
  });
  items.length = 0;
}

export function parseLegalMarkdown(source: string): LegalDocumentData {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const doc: LegalDocumentData = {
    title: "",
    intro: [],
    sections: [],
  };

  let currentBlocks = doc.intro;
  const paragraph: string[] = [];
  const listItems: string[] = [];

  const currentTarget = () => currentBlocks;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList(listItems, currentTarget());
      flushParagraph(paragraph, currentTarget());
      continue;
    }

    if (line.startsWith("# ") && !doc.title) {
      doc.title = line.slice(2).trim();
      continue;
    }

    if (line.startsWith("**") && line.includes("به‌روزرسانی") && !doc.lastUpdated) {
      doc.lastUpdated = line.replace(/^\*\*|\*\*$/g, "").trim();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList(listItems, currentTarget());
      flushParagraph(paragraph, currentTarget());
      const title = line.slice(3).trim();
      const section: LegalSection = {
        id: slugifyHeading(title, doc.sections.length),
        title,
        blocks: [],
      };
      doc.sections.push(section);
      currentBlocks = section.blocks;
      continue;
    }

    if (line.startsWith("### ")) {
      flushList(listItems, currentTarget());
      flushParagraph(paragraph, currentTarget());
      currentTarget().push({
        type: "h3",
        parts: parseInline(line.slice(4).trim()),
      });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph(paragraph, currentTarget());
      listItems.push(line.slice(2).trim());
      continue;
    }

    flushList(listItems, currentTarget());
    paragraph.push(line);
  }

  flushList(listItems, currentTarget());
  flushParagraph(paragraph, currentTarget());

  return doc;
}
