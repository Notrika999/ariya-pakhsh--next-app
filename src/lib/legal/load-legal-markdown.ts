import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseLegalMarkdown, type LegalDocumentData } from "./parse-legal-markdown";

export async function loadLegalMarkdown(
  filename: "terms.md" | "privacy-policy.md",
): Promise<LegalDocumentData> {
  const filePath = path.join(process.cwd(), "content", "legal", filename);
  const source = await readFile(filePath, "utf8");
  return parseLegalMarkdown(source);
}
