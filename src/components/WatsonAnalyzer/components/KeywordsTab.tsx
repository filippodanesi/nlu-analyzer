
import React from 'react';
import { AlertCircle, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KeywordsTabProps {
  keywords: any[];
  containsTargetKeyword: (text: string) => boolean;
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ keywords, containsTargetKeyword }) => {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-md">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <AlertCircle size={16} />
          <p>No keywords found in the analyzed text.</p>
        </div>
      </div>
    );
  }

  // Check if there are any multi-word keywords
  const hasMultiWordKeywords = keywords.some(keyword => keyword.text.includes(' '));
  
  // Count words in a phrase
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Text</TableHead>
              <TableHead>Words</TableHead>
              <TableHead>Relevance</TableHead>
              {keywords[0].sentiment && <TableHead>Sentiment</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword: any, index: number) => {
              const hasTargetKeyword = containsTargetKeyword(keyword.text);
              const wordCount = countWords(keyword.text);
              return (
                <TableRow key={index} className={hasTargetKeyword ? "bg-green-500/10" : ""}>
                  <TableCell className={`font-medium ${hasTargetKeyword ? "text-green-600" : ""}`}>
                    {keyword.text}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50">
                      {wordCount}
                    </Badge>
                  </TableCell>
                  <TableCell>{(keyword.relevance * 100).toFixed(1)}%</TableCell>
                  {keyword.sentiment && (
                    <TableCell>
                      <Badge 
                        variant={keyword.sentiment.score > 0 ? "default" : keyword.sentiment.score < 0 ? "destructive" : "outline"}
                      >
                        {keyword.sentiment.score.toFixed(2)}
                      </Badge>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {!hasMultiWordKeywords && (
        <div className="flex items-center space-x-2 text-sm bg-amber-50 border border-amber-200 p-3 rounded-md">
          <Info className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <p className="text-amber-800">
            In un'implementazione reale di Watson NLU, l'API può identificare parole chiave composte da più termini (come "natural language processing"). 
            Questa versione demo riporta solo parole singole per semplicità.
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordsTab;
