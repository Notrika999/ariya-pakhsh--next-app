type JsonPrimitive = string | number | boolean | null;

export type JsonLdValue =
  | JsonPrimitive
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

type JsonLdProps = {
  data: JsonLdValue;
  id?: string;
};

function serializeJsonLd(data: JsonLdValue): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
