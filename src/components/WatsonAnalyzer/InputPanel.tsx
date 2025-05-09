
import React, { useState, useRef } from 'react';
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
import { Upload, File } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update the file name display
    setFileName(file.name);

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Could not read the selected file",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
          onValueChange={(value) => {
            setInputMethod(value as "text" | "file");
            if (value === "file" && !fileName) {
              // When switching to file mode without having uploaded yet, show the file picker
              setTimeout(() => handleUploadClick(), 100);
            }
          }}
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
            <div className="flex flex-col gap-2">
              <input 
                id="text-file" 
                type="file" 
                ref={fileInputRef}
                accept=".txt,.doc,.docx,.rtf,.pdf,.md,.html,.json,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md p-6 cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleUploadClick}>
                <File className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">
                  {fileName ? fileName : "Click to upload a text file"}
                </p>
                <p className="text-xs text-muted-foreground">
                  TXT, DOC, DOCX, PDF, RTF, MD, HTML, JSON, CSV
                </p>
              </div>
              
              {fileName && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change file
                </Button>
              )}
            </div>

            {text && (
              <div className="space-y-2">
                <Label htmlFor="file-preview">Preview</Label>
                <Textarea
                  id="file-preview"
                  value={text}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                />
              </div>
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
