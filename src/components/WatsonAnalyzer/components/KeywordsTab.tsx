
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
import { isExactKeywordMatch, isPartialKeywordMatch } from '../utils/optimizationUtils';

interface KeywordsTabProps {
  keywords: any[];
  containsTargetKeyword: (text: string) => boolean;
  targetKeywords: string[];
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ keywords, containsTargetKeyword, targetKeywords }) => {
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

  // Controlla il tipo di corrispondenza con le keyword target
  const checkKeywordMatch = (text: string) => {
    // Controllo per corrispondenze esatte
    for (const keyword of targetKeywords) {
      if (isExactKeywordMatch(text, keyword)) {
        return "exact";
      }
    }
    
    // Controllo per corrispondenze parziali
    for (const keyword of targetKeywords) {
      if (isPartialKeywordMatch(text, keyword)) {
        return "partial";
      }
    }
    
    // Nessuna corrispondenza
    return "none";
  };
  
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword: any, index: number) => {
              const matchType = checkKeywordMatch(keyword.text);
              const wordCount = countWords(keyword.text);
              
              let rowClassName = "";
              let textClassName = "font-medium";
              
              if (matchType === "exact") {
                rowClassName = "bg-green-500/10";
                textClassName = "font-medium text-green-600";
              } else if (matchType === "partial") {
                rowClassName = "bg-orange-500/10";
                textClassName = "font-medium text-orange-600";
              }
              
              return (
                <TableRow key={index} className={rowClassName}>
                  <TableCell className={textClassName}>
                    {keyword.text}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50">
                      {wordCount}
                    </Badge>
                  </TableCell>
                  <TableCell>{(keyword.relevance * 100).toFixed(1)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
      
      {targetKeywords.length > 0 && (
        <div className="flex flex-col gap-1 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            <span>Corrispondenza esatta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500/70"></div>
            <span>Corrispondenza parziale</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordsTab;
