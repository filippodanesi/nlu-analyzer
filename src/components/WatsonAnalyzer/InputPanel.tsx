
import React, { useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InputMethodToggle from './components/InputMethodToggle';
import TextInputSection from './components/TextInputSection';
import FileUploadSection from './components/FileUploadSection';
import KeywordsSection from './components/KeywordsSection';

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
          Enter or upload the text you want to analyze
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
        ) : (
          <FileUploadSection text={text} setText={setText} />
        )}

        <KeywordsSection 
          targetKeywords={targetKeywords}
          setTargetKeywords={setTargetKeywords}
        />
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
