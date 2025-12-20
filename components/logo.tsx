import Image from "next/image";

interface LogoProps {
  /**
   * Width of the logo in pixels
   * @default 157 (half of original 314px width for better display)
   */
  width?: number;
  /**
   * Height of the logo in pixels
   * @default 65 (half of original 130px height for better display)
   */
  height?: number;
  /**
   * Additional CSS classes to apply to the logo container
   */
  className?: string;
  /**
   * Priority loading for above-the-fold images
   * @default false
   */
  priority?: boolean;
  /**
   * Alternative text for accessibility
   * @default "FoodHub Logo"
   */
  alt?: string;
}

/**
 * Reusable FoodHub logo component
 *
 * @example
 * // Default size
 * <Logo />
 *
 * @example
 * // Custom size
 * <Logo width={100} height={50} />
 *
 * @example
 * // With custom styling
 * <Logo className="mx-auto" />
 */
export function Logo({
  width = 157,
  height = 65,
  className = "",
  priority = false,
  alt = "FoodHub Logo",
}: LogoProps) {
  return (
    <div className={className}>
      <Image
        src="/logo.svg"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
}
