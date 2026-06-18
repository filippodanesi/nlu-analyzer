
import React from 'react';
import { CheckCircle2, Sparkles } from "lucide-react";

interface OptimizationGuidanceProps {
  totalKeywords: number;
  keywordsToOptimize: string[];
  keywordsWithPartialMatch: string[];
  hasOptimized: boolean;
}

/**
 * A single, prescriptive line that tells the user exactly what to do next to
 * improve the text. Replaces the previous three coloured alert variants.
 */
const OptimizationGuidance: React.FC<OptimizationGuidanceProps> = ({
  totalKeywords,
  keywordsToOptimize,
  keywordsWithPartialMatch,
  hasOptimized,
}) => {
  const missing = keywordsToOptimize.length;
  const partial = keywordsWithPartialMatch.length;
  const isWellOptimized = missing === 0 && partial === 0;

  const Icon = isWellOptimized ? CheckCircle2 : Sparkles;
  const accent = isWellOptimized ? "text-emerald-600 dark:text-emerald-400" : "text-foreground";

  let headline: string;
  let detail: string;

  if (isWellOptimized) {
    headline = `All ${totalKeywords} target keyword${totalKeywords === 1 ? "" : "s"} are in the text.`;
    detail = hasOptimized
      ? "The optimized version covers every keyword — copy it below to use it."
      : "Your text is already well optimized for these keywords.";
  } else {
    const parts: string[] = [];
    if (missing) parts.push(`${missing} missing`);
    if (partial) parts.push(`${partial} only partial`);
    headline = `${parts.join(" · ")} of ${totalKeywords} target keyword${totalKeywords === 1 ? "" : "s"}.`;
    detail = 'Click "Optimize Text" to weave them in naturally — your tone, language and structure stay intact.';
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-muted/40 p-3">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`} />
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{headline}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
};

export default OptimizationGuidance;
