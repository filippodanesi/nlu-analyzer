
import React, { useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import InputMethodToggle from './components/InputMethodToggle';
import TextInputSection from './components/TextInputSection';
import FileUploadSection from './components/FileUploadSection';
import UrlInputSection from './components/UrlInputSection';
import KeywordsSection from './components/KeywordsSection';

interface InputPanelProps {
  text: string;
  setText: (text: string) => void;
  inputMethod: "text" | "file" | "url";
  setInputMethod: (method: "text" | "file" | "url") => void;
  targetKeywords: string;
  setTargetKeywords: (keywords: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  features?: {
    keywords: boolean;
    entities: boolean;
    concepts: boolean;
    categories: boolean;
    classifications: boolean;
  };
}

const InputPanel: React.FC<InputPanelProps> = ({
  text,
  setText,
  inputMethod,
  setInputMethod,
  targetKeywords,
  setTargetKeywords,
  onAnalyze,
  isAnalyzing,
  features
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [enableReanalyze, setEnableReanalyze] = React.useState(false);
  const featuresRef = React.useRef(features);

  // Effect to detect feature changes and enable reanalysis
  useEffect(() => {
    // Skip on first render
    if (featuresRef.current !== features && features) {
      // Check if features changed
      const hasChanges = featuresRef.current && (
        featuresRef.current.keywords !== features.keywords ||
        featuresRef.current.entities !== features.entities ||
        featuresRef.current.concepts !== features.concepts ||
        featuresRef.current.categories !== features.categories ||
        featuresRef.current.classifications !== features.classifications
      );
      
      if (hasChanges) {
        setEnableReanalyze(true);
      }
      
      // Update reference
      featuresRef.current = features;
    }
  }, [features]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Input</CardTitle>
        <CardDescription>
          Enter text, upload a file, or input a URL to analyze
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <InputMethodToggle 
          inputMethod={inputMethod} 
          setInputMethod={setInputMethod} 
          onFileSwitch={handleUploadClick}
        />

        {inputMethod === "text" ? (
          <TextInputSection text={text} setText={setText} />
        ) : inputMethod === "file" ? (
          <FileUploadSection text={text} setText={setText} />
        ) : (
          <UrlInputSection text={text} setText={setText} />
        )}

        <KeywordsSection 
          targetKeywords={targetKeywords}
          setTargetKeywords={setTargetKeywords}
        />
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <Button 
          onClick={() => {
            onAnalyze();
            setEnableReanalyze(false);
          }}
          disabled={(!text || isAnalyzing) && !enableReanalyze}
          className="w-full"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>

        {enableReanalyze && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Analysis features changed — click Analyze to update results.
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default InputPanel;
