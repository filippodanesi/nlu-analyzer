
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOptimizationConfig } from "../../hooks/optimization/useOptimizationConfig";
import {
  extractDomainEntities,
  ENTITY_TYPES,
  type DomainEntity,
} from "../../utils/entityExtractionUtils";

interface DomainEntitiesSectionProps {
  text: string;
}

/**
 * On-demand, AI-based extraction of fashion-domain entities (Brand, ProductType,
 * Material, Feature, Benefit) — the taxonomy Watson's general model can't produce.
 * Results are clearly labelled as AI-derived and carry no fabricated scores.
 */
const DomainEntitiesSection: React.FC<DomainEntitiesSectionProps> = ({ text }) => {
  const { apiKey, aiModel, aiProvider } = useOptimizationConfig();
  const [entities, setEntities] = useState<DomainEntity[] | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const providerLabel = aiProvider === "anthropic" ? "Claude" : "OpenAI";

  const handleExtract = async () => {
    setIsExtracting(true);
    try {
      const result = await extractDomainEntities(text, apiKey, aiModel);
      setEntities(result);
      if (result.length === 0) {
        toast({
          title: "No domain entities found",
          description: "The model did not find Brand/ProductType/Material/Feature/Benefit entities in this text.",
        });
      }
    } catch (error) {
      toast({
        title: "Extraction failed",
        description: error instanceof Error ? error.message : "Could not extract entities.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium text-foreground">Domain entities (AI)</h3>
          <p className="text-xs text-muted-foreground">
            Brand · ProductType · Material · Feature · Benefit — the taxonomy Watson's general model can't detect.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExtract}
          disabled={isExtracting || !apiKey || !text}
          className="shrink-0 gap-1.5"
        >
          {isExtracting ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {entities ? "Re-extract" : "Extract with AI"}
        </Button>
      </div>

      {!apiKey && (
        <p className="text-xs text-muted-foreground">
          Add an AI key in the AI Optimization panel to enable this.
        </p>
      )}

      {entities && entities.length > 0 && (
        <div className="space-y-2">
          {ENTITY_TYPES.map((type) => {
            const items = entities.filter((e) => e.type === type);
            if (items.length === 0) return null;
            return (
              <div key={type} className="flex flex-wrap items-center gap-2">
                <span className="w-24 shrink-0 text-xs text-muted-foreground">{type}</span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((entity, index) => (
                    <Badge key={index} variant="outline">{entity.text}</Badge>
                  ))}
                </div>
              </div>
            );
          })}
          <p className="pt-1 text-xs text-muted-foreground">
            AI-derived from the text via {providerLabel} — not Watson NLU. No confidence scores.
          </p>
        </div>
      )}

      {entities && entities.length === 0 && (
        <p className="text-xs text-muted-foreground">No domain entities found in this text.</p>
      )}
    </div>
  );
};

export default DomainEntitiesSection;
