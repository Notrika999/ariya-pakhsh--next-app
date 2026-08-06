// components/common/SectionContainer.tsx
interface Props {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const SectionContainer = ({
  children,
  fullWidth = false,
  className = "",
}: Props) => {
  if (fullWidth) {
    return (
      <section className={`max-w-485 mx-auto mt-7 mb-5  ${className}`}>
        {children}
      </section>
    );
  }

  return (
    <section className={`max-w-400 mx-auto mt-7 mb-5  px-4 w-full rounded-lg  ${className}`}>
      {children}
    </section>
  );
};
