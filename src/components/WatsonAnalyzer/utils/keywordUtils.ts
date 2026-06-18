/**
 * Keyword matching utilities.
 *
 * Matching is Unicode-aware and respects word boundaries, so "bra" no longer
 * matches "bracelet" and accented copy (e.g. Italian) is handled correctly.
 * Use `matchKeywordInText` for the canonical three-state result.
 */

export type KeywordMatch = "exact" | "partial" | "missing";

const normalize = (value: string): string =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Whole-word / whole-phrase test that works with Unicode letters and digits.
 * The phrase must be bounded by a non-letter/non-digit (or the start/end of the
 * string). Falls back to a plain substring test if the engine lacks Unicode
 * look-behind support, so it can never throw.
 */
const containsWholePhrase = (text: string, phrase: string): boolean => {
  if (!phrase) return false;
  try {
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(phrase)}(?![\\p{L}\\p{N}])`,
      "iu"
    );
    return pattern.test(text);
  } catch {
    return text.includes(phrase);
  }
};

/**
 * Classifies how a target keyword appears in a body of text:
 *  - "exact":   the full phrase appears as a whole word / phrase
 *  - "partial": it appears only as a substring (plural, hyphenation, glued
 *               variant) or only some words of a multi-word keyword are present
 *  - "missing": not present at all
 */
export const matchKeywordInText = (text: string, keyword: string): KeywordMatch => {
  const normalizedText = normalize(text || "");
  const normalizedKeyword = normalize(keyword || "");
  if (!normalizedText || !normalizedKeyword) return "missing";

  if (containsWholePhrase(normalizedText, normalizedKeyword)) return "exact";

  // Substring presence covers plurals, hyphenation and glued variants.
  if (normalizedText.includes(normalizedKeyword)) return "partial";

  // Multi-word keyword: count it as partial when any meaningful word is present.
  const words = normalizedKeyword.split(" ").filter((word) => word.length > 2);
  if (words.length > 1 && words.some((word) => containsWholePhrase(normalizedText, word))) {
    return "partial";
  }

  return "missing";
};

/** True when an extracted keyword is exactly the target (normalised). */
export const isExactKeywordMatch = (text: string, targetKeyword: string): boolean =>
  !!text && !!targetKeyword && normalize(text) === normalize(targetKeyword);

/** True when the target appears inside the extracted keyword but is not equal to it. */
export const isPartialKeywordMatch = (text: string, targetKeyword: string): boolean => {
  if (!text || !targetKeyword) return false;
  const candidate = normalize(text);
  const target = normalize(targetKeyword);
  return candidate !== target && candidate.includes(target);
};
