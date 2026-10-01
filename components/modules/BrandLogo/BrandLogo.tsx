import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  showText?: boolean;
  priority?: boolean;
}

export default function BrandLogo({
  className = "",
  logoClassName = "h-11 w-11",
  textClassName = "h-8 md:h-10",
  showText = true,
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex shrink-0">
        <Image
          width={44}
          height={44}
          className={`${logoClassName} object-contain dark:hidden`}
          src="/images/logo/Logo.svg"
          priority={priority}
          alt="Carup24"
        />
        <Image
          width={44}
          height={44}
          className={`${logoClassName} hidden object-contain dark:block`}
          src="/images/logo/Logo%20White.png"
          priority={priority}
          alt="Carup24"
        />
      </span>

      {showText ? (
        <span className="relative inline-flex shrink-0">
          <Image
            width={114}
            height={44}
            className={`${textClassName} w-auto object-contain dark:hidden`}
            src="/images/logo/Text.svg"
            priority={priority}
            alt="Carup24"
          />
          <Image
            width={114}
            height={44}
            className={`${textClassName} hidden w-auto object-contain dark:block`}
            src="/images/logo/Text%20White.svg"
            priority={priority}
            alt="Carup24"
          />
        </span>
      ) : null}
    </span>
  );
}
