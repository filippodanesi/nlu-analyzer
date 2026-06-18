/**
 * AI-based domain entity extraction.
 *
 * IBM Watson's general NER model does not know fashion product entities
 * (ProductType, Material, Feature, Benefit). This module asks Claude to extract
 * entities using that taxonomy instead.
 *
 * Honesty rules (deliberate): we return typed phrases only — never fabricated
 * confidence/relevance scores — and we instruct the model to extract strictly
 * what appears in the text, not to invent entities.
 */
import Anthropic from '@anthropic-ai/sdk';
import { AI_MODEL } from './aiConfig';

export const ENTITY_TYPES = ["Brand", "ProductType", "Material", "Feature", "Benefit"] as const;
export type DomainEntityType = (typeof ENTITY_TYPES)[number];

export interface DomainEntity {
  text: string;
  type: DomainEntityType;
}

const EXTRACTION_SYSTEM_PROMPT = `You extract product entities from fashion and lingerie copy for Triumph.

Rules:
- Extract ONLY entities that appear explicitly in the text. Never invent or infer entities that are not present.
- Classify each entity into exactly one of these types: Brand, ProductType, Material, Feature, Benefit.
- Prefer rich, multi-word phrases (2–5 words) over generic single words.
- Do not include colours or sizes.
- Return ONLY a JSON array of objects shaped {"text": string, "type": string}. No prose, no markdown, no code fences.`;

/** Pulls a JSON array out of a model response that may be fenced or wrapped in prose. */
const parseEntities = (raw: string): DomainEntity[] => {
  if (!raw) return [];
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const seen = new Set<string>();
  const result: DomainEntity[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const text = typeof obj.text === "string" ? obj.text.trim() : "";
    const type = obj.type;
    if (!text || typeof type !== "string" || !ENTITY_TYPES.includes(type as DomainEntityType)) continue;
    const key = `${type}:${text.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ text, type: type as DomainEntityType });
  }
  return result;
};

/**
 * Extracts domain entities from text using Claude.
 */
export const extractDomainEntities = async (
  text: string,
  apiKey: string,
  model: string = AI_MODEL
): Promise<DomainEntity[]> => {
  if (!text.trim()) return [];

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const response = await client.messages.create({
    model,
    system: EXTRACTION_SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
    max_tokens: 1024,
  });

  const block = response.content.find(
    (b) => "type" in b && b.type === "text" && "text" in b
  );
  return parseEntities(block && "text" in block ? block.text : "");
};
