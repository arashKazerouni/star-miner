import Image from "next/image";

export function FarmLogo({
  size = 40,
}: {
  size?: number;
}) {
  return (
    <Image
      src="/logo.png"
      alt="FARM"
      width={size}
      height={size}
      className="object-contain"
    />
  );
}