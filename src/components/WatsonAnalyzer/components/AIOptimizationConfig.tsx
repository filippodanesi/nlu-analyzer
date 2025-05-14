
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AIOptimizationConfigProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
}

// Define different AI providers
export type AIProvider = "openai" | "anthropic";

const AIOptimizationConfig: React.FC<AIOptimizationConfigProps> = ({
  apiKey,
  setApiKey,
  aiModel,
  setAiModel
}) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isOpen, setIsOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AIProvider>(aiModel.startsWith("claude") ? "anthropic" : "openai");

  const handleSave = () => {
    setApiKey(tempApiKey);
    setIsOpen(false);
  };

  const handleProviderChange = (provider: AIProvider) => {
    setActiveProvider(provider);
    // Set a default model for the selected provider
    if (provider === "openai" && aiModel.startsWith("claude")) {
      setAiModel("gpt-4o-mini");
    } else if (provider === "anthropic" && !aiModel.startsWith("claude")) {
      setAiModel("claude-3-sonnet-20240229");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Key className="h-4 w-4" />
          Configure AI
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Optimization Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Tabs 
            defaultValue={activeProvider} 
            onValueChange={(value) => handleProviderChange(value as AIProvider)}
            value={activeProvider}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="openai">OpenAI</TabsTrigger>
              <TabsTrigger value="anthropic">Anthropic (Claude)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="openai" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model-openai">AI Model</Label>
                <Select 
                  value={aiModel.startsWith("gpt") ? aiModel : "gpt-4o-mini"} 
                  onValueChange={setAiModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">OpenAI GPT-4o-mini</SelectItem>
                    <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key-openai">API Key</Label>
                <Input
                  id="api-key-openai"
                  type="password"
                  placeholder="Enter your OpenAI API key"
                  value={activeProvider === "openai" ? tempApiKey : ""}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="font-mono"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="anthropic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model-claude">AI Model</Label>
                <Select 
                  value={aiModel.startsWith("claude") ? aiModel : "claude-3-sonnet-20240229"} 
                  onValueChange={setAiModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                    <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-7-sonnet-20240620">Claude 3.7 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key-claude">API Key</Label>
                <Input
                  id="api-key-claude"
                  type="password"
                  placeholder="Enter your Anthropic API key"
                  value={activeProvider === "anthropic" ? tempApiKey : ""}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="font-mono"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIOptimizationConfig;
