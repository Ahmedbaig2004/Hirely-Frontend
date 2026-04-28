import Image from "next/image";
import { cn } from "@/components/lib/utils";
import { BrandThreeBarE } from "@/components/branding/BrandThreeBarE";
import { hirelyWordmarkMetrics } from "@/components/branding/hirelyWordmarkMetrics";
import { iconToWordmarkGapEm, navHMarkHeightEm } from "@/components/branding/hirelyBrandLockup";

type HirelyNavLockupProps = {
  /** Kept for call-site context; H I R L Y use `text-[#0a0a0a] dark:text-white` unless `textClassName` overrides. */
  isLight: boolean;
  textClassName?: string;
  className?: string;
  /** Stylized H mark to the left of the full H I R E̲ L Y wordmark. */
  withHMark?: boolean;
  /** Optional extra classes on the H mark (e.g. animation). */
  markClassName?: string;
  imagePriority?: boolean;
};

const H_MARK = "/branding/hirely-h-mark.png";

/** Light: near-black; dark: white (`dark` matches `html.dark` from next-themes). */
const DEFAULT_TEXT =
  "text-[0.85rem] sm:text-[0.9rem] leading-none text-[#0a0a0a] dark:text-white";

export function HirelyNavLockup({
  isLight,
  textClassName,
  className,
  withHMark = false,
  markClassName,
  imagePriority = true,
}: HirelyNavLockupProps) {
  const colorClasses = textClassName ?? DEFAULT_TEXT;

  const letters = (
    <>
      <span className="inline-block shrink-0 [line-height:1]">H</span>
      <span className="inline-block shrink-0 [line-height:1]">I</span>
      <span className="inline-block shrink-0 [line-height:1]">R</span>
      <BrandThreeBarE variant="nav" />
      <span className="inline-block shrink-0 [line-height:1]">L</span>
      <span className="inline-block shrink-0 [line-height:1]">Y</span>
    </>
  );

  const wordmarkStyle = {
    fontFamily: "var(--font-brand), system-ui, sans-serif",
    fontWeight: hirelyWordmarkMetrics.fontWeight,
    gap: hirelyWordmarkMetrics.letterSpacing,
    letterSpacing: 0,
  } as const;

  if (!withHMark) {
    return (
      <span
        data-hirely-lockup={isLight ? "light" : "dark"}
        className={cn(
          "inline-flex items-end font-black leading-none [line-height:1]",
          colorClasses,
          className,
        )}
        style={wordmarkStyle}
      >
        {letters}
      </span>
    );
  }

  return (
    <span
      data-hirely-lockup={isLight ? "light" : "dark"}
      className={cn(
        "inline-flex items-center leading-none [font-kerning:normal]",
        colorClasses,
        className,
      )}
      style={{
        gap: iconToWordmarkGapEm,
        fontFamily: "var(--font-brand), system-ui, sans-serif",
      }}
    >
      <Image
        src={H_MARK}
        alt=""
        width={128}
        height={128}
        className={cn(
          "block w-auto shrink-0 object-contain object-center",
          markClassName,
        )}
        style={{ height: `${navHMarkHeightEm}em`, width: "auto" }}
        priority={imagePriority}
        aria-hidden
        sizes="(min-width: 640px) 34px, 32px"
      />
      <span
        className="inline-flex items-end self-center font-black [line-height:1] [font-kerning:normal]"
        style={wordmarkStyle}
      >
        {letters}
      </span>
    </span>
  );
}
