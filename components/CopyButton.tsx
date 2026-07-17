"use client";
import { supabase } from "../utils/supabase";
import { useMemo, useState } from "react";

type Props = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton({ value, label = "Copy", className }: Props) {
  const [copied, setCopied] = useState(false);
  const buttonLabel = useMemo(() => (copied ? "Copied" : label), [copied, label]);

  return (
    <button
      type="button"
      className={
        className ??
        "inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10 active:bg-white/15"
      }
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 900);
        } catch {
          // Clipboard can fail in some environments; still keep UX simple.
          setCopied(false);
        }
      }}
      aria-label={`Copy: ${value}`}
    >
      {buttonLabel}
    </button>
  );
}

