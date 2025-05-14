
import React from 'react';
import { 
  Input 
} from "@/components/ui/input";
import { 
  Label 
} from "@/components/ui/label";

interface LimitsSectionProps {
  limits: {
    keywords: number;
    entities: number;
    concepts: number;
    categories: number;
  };
  handleLimitChange: (feature: string, value: number) => void;
}

export const LimitsSection: React.FC<LimitsSectionProps> = ({ limits, handleLimitChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Limits</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="keywords-limit">Keywords</Label>
            <Input
              id="keywords-limit"
              type="number"
              min="1"
              max="50"
              value={limits.keywords}
              onChange={(e) => handleLimitChange("keywords", parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="entities-limit">Entities</Label>
            <Input
              id="entities-limit"
              type="number"
              min="1"
              max="50"
              value={limits.entities}
              onChange={(e) => handleLimitChange("entities", parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="concepts-limit">Concepts</Label>
            <Input
              id="concepts-limit"
              type="number"
              min="1"
              max="50"
              value={limits.concepts}
              onChange={(e) => handleLimitChange("concepts", parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="categories-limit">Categories</Label>
            <Input
              id="categories-limit"
              type="number"
              min="1"
              max="50"
              value={limits.categories}
              onChange={(e) => handleLimitChange("categories", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
