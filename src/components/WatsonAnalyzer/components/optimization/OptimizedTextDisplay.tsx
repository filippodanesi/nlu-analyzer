
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface OptimizedTextDisplayProps {
  originalText: string;
  optimizedText: string;
}

/**
 * Displays the original and optimized text in a tabbed interface
 */
const OptimizedTextDisplay: React.FC<OptimizedTextDisplayProps> = ({ originalText, optimizedText }) => {
  if (!optimizedText) return null;
  
  return (
    <Tabs defaultValue="original">
      <TabsList className="grid grid-cols-2 mb-2">
        <TabsTrigger value="original">Original Text</TabsTrigger>
        <TabsTrigger value="optimized">Optimized Text</TabsTrigger>
      </TabsList>
      <TabsContent value="original">
        <Textarea 
          readOnly
          value={originalText}
          className="min-h-[200px] font-mono text-sm"
        />
      </TabsContent>
      <TabsContent value="optimized">
        <Textarea 
          readOnly
          value={optimizedText}
          className="min-h-[200px] font-mono text-sm"
        />
      </TabsContent>
    </Tabs>
  );
};

export default OptimizedTextDisplay;
