
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertCircle } from "lucide-react";

interface OptimizedTextDisplayProps {
  originalText: string;
  optimizedText: string;
}

/**
 * Displays the original and optimized text in a tabbed interface
 */
const OptimizedTextDisplay: React.FC<OptimizedTextDisplayProps> = ({ originalText, optimizedText }) => {
  // Return null only if both texts are empty or undefined
  if (!originalText && !optimizedText) return null;
  
  return (
    <Tabs defaultValue={optimizedText ? "optimized" : "original"}>
      <TabsList className="grid grid-cols-2 mb-2">
        <TabsTrigger value="original">Original Text</TabsTrigger>
        <TabsTrigger value="optimized">Optimized Text</TabsTrigger>
      </TabsList>
      <TabsContent value="original">
        <Textarea 
          readOnly
          value={originalText || ""}
          className="min-h-[200px] font-mono text-sm"
        />
      </TabsContent>
      <TabsContent value="optimized">
        {optimizedText ? (
          <Textarea 
            readOnly
            value={optimizedText}
            className="min-h-[200px] font-mono text-sm bg-green-50 text-green-900"
          />
        ) : (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>No optimized text yet</AlertTitle>
            <AlertDescription>
              Click the "Optimize Text" button to generate optimized content with your target keywords.
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default OptimizedTextDisplay;
