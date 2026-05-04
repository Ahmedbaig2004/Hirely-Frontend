"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { COUNTRY_DIAL_LIST, getCountryByIso, type CountryDial } from "@/lib/countryDialCodes";

type Props = {
  countryIso: string;
  onCountryChange: (iso2: string) => void;
  localDigits: string;
  onLocalChange: (digits: string) => void;
  /** id for the number input (label `htmlFor`) */
  inputId: string;
  className?: string;
};

function CountryRow({ c, selected, onPick }: { c: CountryDial; selected: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onPick}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition",
        "hover:bg-slate-200/80 dark:hover:bg-white/[0.08]",
        selected && "bg-cyan-500/10 dark:bg-cyan-500/15"
      )}
    >
      <span className="min-w-0 text-slate-900 dark:text-slate-100">
        <span className="mr-1.5" aria-hidden>
          {c.flag}
        </span>
        {c.name}
      </span>
      <span className="shrink-0 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
        {c.dial}
      </span>
    </button>
  );
}

/**
 * One row: [ flag + dial + chevron ] | [ local number ].
 * List shows full country names. Trigger shows only flag + dial (no duplicate country code letters next to the flag).
 */
export function InternationalPhoneField({
  countryIso,
  onCountryChange,
  localDigits,
  onLocalChange,
  inputId,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const countryBtnId = `${inputId}-country`;

  const selected = getCountryByIso(countryIso) ?? COUNTRY_DIAL_LIST[0];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const fieldShell =
    "flex min-h-[46px] min-w-0 w-full overflow-hidden rounded-xl border border-white/50 bg-[var(--lp-input-bg)] shadow-sm backdrop-blur-md transition focus-within:border-cyan-600/45 focus-within:ring-2 focus-within:ring-cyan-500/25 dark:border-white/[0.1] dark:bg-white/[0.04] dark:focus-within:border-cyan-400/35 dark:focus-within:ring-cyan-500/15";

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className={fieldShell} role="group" aria-label="Phone number">
        <button
          id={countryBtnId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`Country code, ${selected.name} ${selected.dial}`}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 border-0 border-r border-white/50 bg-transparent py-3 pl-3 pr-2",
            "text-left text-sm text-slate-900 transition hover:bg-slate-500/[0.06] dark:border-white/[0.1] dark:text-slate-100",
            "focus:outline-none focus-visible:bg-slate-500/[0.08] dark:focus-visible:bg-white/[0.04]"
          )}
        >
          <span className="text-lg leading-none" aria-hidden>
            {selected.flag}
          </span>
          <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-200">
            {selected.dial}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 text-slate-500 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>

        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={localDigits}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 15);
            onLocalChange(digits);
          }}
          placeholder="Phone number"
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent py-3 pr-4 text-sm text-slate-900 outline-none",
            "placeholder:text-slate-500 dark:text-slate-100 dark:placeholder:text-slate-500"
          )}
          aria-label="National phone number without country code"
        />
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Choose country"
          className="absolute left-0 right-0 z-[100] mt-1 max-h-64 overflow-y-auto overflow-x-hidden rounded-xl border border-white/50 bg-[var(--lp-input-bg)] py-1 shadow-lg backdrop-blur-md dark:border-white/[0.1] dark:bg-slate-900/95"
        >
          {COUNTRY_DIAL_LIST.map((c) => (
            <li key={c.iso2} role="none" className="list-none">
              <CountryRow
                c={c}
                selected={c.iso2 === countryIso}
                onPick={() => {
                  onCountryChange(c.iso2);
                  setOpen(false);
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
