import Image from "next/image";

type TokenIconProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
};

export function TokenIcon({
  src,
  alt,
  size = 48,
  className = "",
  priority = false,
}: TokenIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={`object-contain drop-shadow-md ${className}`}
    />
  );
}
