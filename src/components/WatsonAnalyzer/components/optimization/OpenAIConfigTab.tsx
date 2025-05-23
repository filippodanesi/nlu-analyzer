
import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface OpenAIConfigTabProps {
  aiModel: string;
  setAiModel: (model: string) => void;
  tempOpenAIKey: string;
  setTempOpenAIKey: (key: string) => void;
  openAIKeyWarning: string | null;
}

const OpenAIConfigTab: React.FC<OpenAIConfigTabProps> = ({
  aiModel,
  setAiModel,
  tempOpenAIKey,
  setTempOpenAIKey,
  openAIKeyWarning
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ai-model-openai">AI Model</Label>
        <Select 
          value={aiModel.startsWith("gpt") || aiModel.startsWith("o4") ? aiModel : "gpt-4o-mini"} 
          onValueChange={setAiModel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o-mini">OpenAI GPT-4o-mini</SelectItem>
            <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
            <SelectItem value="o4-mini-2025-04-16">OpenAI o4-mini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-key-openai">API Key</Label>
        <Input
          id="api-key-openai"
          type="password"
          placeholder="Enter your OpenAI API key (starts with sk-)"
          value={tempOpenAIKey}
          onChange={(e) => setTempOpenAIKey(e.target.value)}
          className="font-mono"
        />
        {openAIKeyWarning && (
          <p className="text-xs text-amber-600 mt-1">{openAIKeyWarning}</p>
        )}
      </div>
    </div>
  );
};

export default OpenAIConfigTab;
