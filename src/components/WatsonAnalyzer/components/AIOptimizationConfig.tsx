
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AI_MODEL_LABEL } from '../utils/aiConfig';

interface AIOptimizationConfigProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

/**
 * Minimal AI configuration: just the Anthropic API key. The model is fixed,
 * so there is nothing else to choose.
 */
const AIOptimizationConfig: React.FC<AIOptimizationConfigProps> = ({ apiKey, setApiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  useEffect(() => setTempKey(apiKey), [apiKey]);

  const warning =
    tempKey && !tempKey.startsWith("sk-ant-") && !tempKey.startsWith("sk-")
      ? "Anthropic keys usually start with 'sk-ant-'."
      : null;

  const handleSave = () => {
    setApiKey(tempKey);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-3.5 w-3.5" />
          {apiKey ? "AI key set" : "Add AI key"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anthropic API key</DialogTitle>
          <DialogDescription>
            Powers AI text optimization and domain-entity extraction ({AI_MODEL_LABEL}).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Input
            type="password"
            placeholder="sk-ant-..."
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
          />
          {warning && <p className="text-xs text-amber-600 dark:text-amber-400">{warning}</p>}
          <p className="text-xs text-muted-foreground">
            Get one at console.anthropic.com. Stored only in this browser session.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="w-full">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIOptimizationConfig;
