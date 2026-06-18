import type React from 'react';
import { Check, Minus, X } from "lucide-react";
import type { KeywordStatus } from '../../hooks/useTextOptimization';

/**
 * Single source of truth for how each keyword status is labelled and coloured.
 * Shared by the badge and the legend so the two never drift.
 */
export const KEYWORD_STATUS_META: Record<
  KeywordStatus,
  { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  exact: {
    label: "Present",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Icon: Check,
  },
  partial: {
    label: "Partial",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Icon: Minus,
  },
  missing: {
    label: "Missing",
    className: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
    Icon: X,
  },
};

export const KEYWORD_STATUS_ORDER: KeywordStatus[] = ["exact", "partial", "missing"];
