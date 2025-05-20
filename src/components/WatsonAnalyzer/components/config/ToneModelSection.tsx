
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

interface ToneModelSectionProps {
  toneModel: string;
  setToneModel: (model: string) => void;
}

export const ToneModelSection: React.FC<ToneModelSectionProps> = ({ toneModel, setToneModel }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Modello di Tono</h3>
      <div className="space-y-2">
        <Label htmlFor="tone-model">Modello per l'analisi del tono</Label>
        <Select value={toneModel} onValueChange={setToneModel}>
          <SelectTrigger id="tone-model">
            <SelectValue placeholder="Seleziona un modello" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="customer-engagement">Customer Engagement</SelectItem>
            <SelectItem value="customer-care">Customer Care</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
