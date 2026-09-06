import type { ReactNode } from "react";
import SectionHeading from "../SectionHeading";

export const MAGAZINE_SECTION_SHELL =
  "rounded-xl bg-white p-5 md:p-8 dark:bg-custom-dark";

type MagazineSectionProps = {
  title?: string;
  subtitle?: string;
  titleId: string;
  href?: string;
  children: ReactNode;
};

export default function MagazineSection({
  title,
  subtitle,
  titleId,
  href,
  children,
}: MagazineSectionProps) {
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : "بخش مجله"}
      className={MAGAZINE_SECTION_SHELL}
    >
      <SectionHeading
        title={title}
        subtitle={subtitle}
        titleId={titleId}
        href={href}
      />
      {children}
    </section>
  );
}
