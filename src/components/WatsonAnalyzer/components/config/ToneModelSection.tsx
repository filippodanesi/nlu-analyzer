
import React from 'react';
import { 
  Label 
} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { AnalysisProvider } from "../../hooks/useAnalysisProvider";

interface ToneModelSectionProps {
  toneModel: string;
  setToneModel: (model: string) => void;
  provider?: AnalysisProvider;
}

export const ToneModelSection: React.FC<ToneModelSectionProps> = ({ 
  toneModel, 
  setToneModel, 
  provider = "watson" 
}) => {
  // Determine if the current provider is Google
  const isGoogle = provider === "google";
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Tone Model</h3>
      <div className="space-y-2">
        <Label htmlFor="tone-model">
          {isGoogle ? "NLP Model for Analysis" : "Model for Tone Analysis"}
        </Label>
        <Select value={toneModel} onValueChange={setToneModel}>
          <SelectTrigger id="tone-model">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {isGoogle ? (
              <>
                <SelectItem value="default">Google NLP Standard</SelectItem>
                <SelectItem value="content-classification">Content Classification</SelectItem>
                <SelectItem value="entity-sentiment">Entity Sentiment</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="customer-engagement">Customer Engagement</SelectItem>
                <SelectItem value="customer-care">Customer Care</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
