
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Key, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AIProvider } from '../hooks/useTextOptimization';
import CorsProxy from './CorsProxy';

interface AIOptimizationConfigProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  aiProvider?: AIProvider;
  setAiProvider?: (provider: AIProvider) => void;
}

const AIOptimizationConfig: React.FC<AIOptimizationConfigProps> = ({
  apiKey,
  setApiKey,
  aiModel,
  setAiModel,
  aiProvider = "openai",
  setAiProvider
}) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isOpen, setIsOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AIProvider>(aiProvider);

  const handleSave = () => {
    setApiKey(tempApiKey);
    setIsOpen(false);
  };

  const handleProviderChange = (provider: AIProvider) => {
    setActiveProvider(provider);
    if (setAiProvider) {
      setAiProvider(provider);
    }
    // Set a default model for the selected provider
    if (provider === "openai" && aiModel.startsWith("claude")) {
      setAiModel("gpt-4o-mini");
    } else if (provider === "anthropic" && !aiModel.startsWith("claude")) {
      setAiModel("claude-3-7-sonnet-20250219");
    }
  };

  // Validate API key format for better user feedback
  const validateApiKey = (key: string, provider: AIProvider): string | null => {
    if (!key || key.trim() === "") return null;
    
    if (provider === "anthropic" && !key.startsWith("sk-ant-") && !key.startsWith("sk-")) {
      return "Claude API keys typically start with 'sk-ant-'";
    }
    
    if (provider === "openai" && !key.startsWith("sk-")) {
      return "OpenAI API keys typically start with 'sk-'";
    }
    
    return null;
  };

  const apiKeyWarning = validateApiKey(tempApiKey, activeProvider);

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
          <DialogDescription>
            Configure API keys and models for AI-powered text optimization
          </DialogDescription>
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
                  value={activeProvider === "openai" ? tempApiKey : ""}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="font-mono"
                />
                {activeProvider === "openai" && apiKeyWarning && (
                  <p className="text-xs text-amber-600 mt-1">{apiKeyWarning}</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="anthropic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model-claude">AI Model</Label>
                <Select 
                  value={aiModel.startsWith("claude") ? aiModel : "claude-3-7-sonnet-20250219"} 
                  onValueChange={setAiModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key-claude">API Key</Label>
                <Input
                  id="api-key-claude"
                  type="password"
                  placeholder="Enter your Anthropic API key (starts with sk-ant-)"
                  value={activeProvider === "anthropic" ? tempApiKey : ""}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="font-mono"
                />
                {activeProvider === "anthropic" && apiKeyWarning && (
                  <p className="text-xs text-amber-600 mt-1">{apiKeyWarning}</p>
                )}
              </div>
              
              {activeProvider === "anthropic" && (
                <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Claude API keys typically start with <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">sk-ant-</code>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="pt-2">
                <CorsProxy className="w-full" />
              </div>
              
              <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                <p>
                  <strong>Note:</strong> Anthropic's Claude API may have CORS restrictions when called directly from a browser.
                  Use the CORS Proxy option to resolve this issue during development.
                </p>
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
