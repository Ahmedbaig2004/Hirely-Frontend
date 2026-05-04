import { cn } from "@/components/lib/utils";
import { eBarGeometry } from "@/components/branding/hirelyBrandLockup";

type BrandThreeBarEProps = {
  variant?: "nav" | "hero";
  className?: string;
};

type SliceProps = {
  heightEm: number;
  offsetEm: number;
  marginBottomEm?: number;
};

function EBarSlice({ heightEm, offsetEm, marginBottomEm }: SliceProps) {
  return (
    <span
      className="block w-full min-h-[1.5px] flex-none rounded-[1px]"
      style={{
        height: `${heightEm}em`,
        marginBottom: marginBottomEm != null ? `${marginBottomEm}em` : undefined,
        background: "var(--hirely-brand-gradient)",
        backgroundSize: "100% 1em",
        backgroundPosition: `0 -${offsetEm}em`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

const { barEm, gapEm, offset0, offset1, offset2 } = eBarGeometry;

export function BrandThreeBarE({ variant = "nav", className }: BrandThreeBarEProps) {
  return (
    <span
      className={cn(
        "box-border inline-flex h-[1em] shrink-0 flex-col items-stretch",
        variant === "hero" ? "w-[0.64em]" : "w-[0.56em]",
        className,
      )}
      aria-hidden
    >
      <EBarSlice
        heightEm={barEm}
        offsetEm={offset0}
        marginBottomEm={gapEm}
      />
      <EBarSlice
        heightEm={barEm}
        offsetEm={offset1}
        marginBottomEm={gapEm}
      />
      <EBarSlice heightEm={barEm} offsetEm={offset2} />
    </span>
  );
}
