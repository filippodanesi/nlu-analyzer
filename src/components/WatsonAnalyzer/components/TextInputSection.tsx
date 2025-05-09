
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface TextInputSectionProps {
  text: string;
  setText: (text: string) => void;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
  text,
  setText
}) => {
  return (
    <Textarea 
      placeholder="Enter text to analyze" 
      className="min-h-[200px] font-mono text-sm"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};

export default TextInputSection;
