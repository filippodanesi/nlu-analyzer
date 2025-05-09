
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface InputPanelProps {
  text: string;
  setText: (text: string) => void;
  inputMethod: "text" | "file";
  setInputMethod: (method: "text" | "file") => void;
  targetKeywords: string;
  setTargetKeywords: (keywords: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  text,
  setText,
  inputMethod,
  setInputMethod,
  targetKeywords,
  setTargetKeywords,
  onAnalyze,
  isAnalyzing
}) => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const targetKeywordsList = targetKeywords
    .split(',')
    .map(kw => kw.trim())
    .filter(Boolean);

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Input</CardTitle>
        <CardDescription>
          Enter or upload the text you want to analyze
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <RadioGroup 
          value={inputMethod} 
          onValueChange={(value) => setInputMethod(value as "text" | "file")}
          className="flex items-center space-x-4 mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text">Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="file" id="file" />
            <Label htmlFor="file">Text file</Label>
          </div>
        </RadioGroup>

        {inputMethod === "text" ? (
          <Textarea 
            placeholder="Enter text to analyze" 
            className="min-h-[200px] font-mono text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="text-file" className="text-sm">Upload text file</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="text-file" 
                  type="file" 
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button size="sm" variant="outline" className="px-2">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Only .txt files are supported
              </p>
            </div>

            {fileContent && (
              <Textarea
                value={fileContent}
                readOnly
                className="min-h-[150px] font-mono text-sm"
              />
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="target-keywords">Target keywords (comma-separated)</Label>
          <Input
            id="target-keywords"
            placeholder="Enter keywords to highlight in results"
            value={targetKeywords}
            onChange={(e) => setTargetKeywords(e.target.value)}
          />
          
          {targetKeywordsList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {targetKeywordsList.map((keyword, index) => (
                <Badge key={index} variant="outline" className="bg-secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={onAnalyze}
          disabled={!text || isAnalyzing}
          className="w-full bg-vercel text-white hover:bg-vercel/90"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InputPanel;
