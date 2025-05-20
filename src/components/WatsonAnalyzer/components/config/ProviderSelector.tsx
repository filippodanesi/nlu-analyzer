
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GoogleIcon, WatsonIcon } from "../icons/ProviderIcons";
import type { AnalysisProvider } from "../../hooks/useAnalysisProvider";

interface ProviderSelectorProps {
  provider: AnalysisProvider;
  setProvider: (provider: AnalysisProvider) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  provider,
  setProvider
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Analysis Provider</h3>
      </div>
      
      <RadioGroup 
        value={provider} 
        onValueChange={(value) => setProvider(value as AnalysisProvider)}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-secondary/20 cursor-pointer">
          <RadioGroupItem value="watson" id="watson" />
          <WatsonIcon className="h-5 w-5 mr-2" />
          <Label htmlFor="watson" className="cursor-pointer">IBM Watson NLU</Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-secondary/20 cursor-pointer">
          <RadioGroupItem value="google" id="google" />
          <GoogleIcon className="h-5 w-5 mr-2" />
          <Label htmlFor="google" className="cursor-pointer">Google Cloud NLP</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ProviderSelector;
