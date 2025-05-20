
import React from 'react';
import { 
  Input 
} from "@/components/ui/input";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Alert,
  AlertDescription 
} from "@/components/ui/alert";
import { 
  InfoIcon
} from "lucide-react";

interface LimitsSectionProps {
  limits: {
    keywords: number;
    entities: number;
    concepts: number;
    categories: number;
  };
  setLimits: (limits: any) => void;
}

export const LimitsSection: React.FC<LimitsSectionProps> = ({ limits, setLimits }) => {
  // Check if entity limit is too low (might explain limited entity detection)
  const hasLowEntityLimit = limits.entities < 10;
  
  const handleLimitChange = (feature: string, value: number) => {
    setLimits({
      ...limits,
      [feature]: value
    });
  };
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Analysis Limits</h3>
      
      {hasLowEntityLimit && (
        <Alert variant="info" className="p-2 text-xs">
          <InfoIcon className="h-3.5 w-3.5" />
          <AlertDescription className="text-xs">
            Setting a higher entity limit can improve detection.
          </AlertDescription>
        </Alert>
      )}
      
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
