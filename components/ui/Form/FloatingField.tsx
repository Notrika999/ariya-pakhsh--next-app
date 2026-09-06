import type { ReactElement, ReactNode } from "react";

type FloatingFieldProps = {
  id: string;
  label: string;
  children: ReactElement<{ id?: string }> | ReactNode;
};

export default function FloatingField({
  id,
  label,
  children,
}: FloatingFieldProps) {
  return (
    <div className="form-group relative">
      {children}
      <label htmlFor={id} className="floating-label">
        {label}
      </label>
    </div>
  );
}
