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
      <section className={`max-w-485 mx-auto my-4 ${className}`}>
        {children}
      </section>
    );
  }

  return (
    <section className={`max-w-400 mx-auto my-4 px-2 w-full  ${className}`}>
      {children}
    </section>
  );
};
