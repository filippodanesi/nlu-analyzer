
import React from 'react';
import { AlertCircle } from "lucide-react";
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

interface KeywordsTabProps {
  keywords: any[];
  containsTargetKeyword: (text: string) => boolean;
  targetKeywords: string[];
  isExactKeywordMatch?: (text: string, targetKeyword: string) => boolean;
  isPartialKeywordMatch?: (text: string, targetKeyword: string) => boolean;
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({
  keywords,
  targetKeywords,
  isExactKeywordMatch,
  isPartialKeywordMatch
}) => {
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

  // Classify an extracted keyword against the user's target keywords.
  const checkKeywordMatch = (text: string): "exact" | "partial" | "none" => {
    if (!targetKeywords.length) return "none";
    if (isExactKeywordMatch && targetKeywords.some(kw => isExactKeywordMatch(text, kw))) {
      return "exact";
    }
    if (isPartialKeywordMatch && targetKeywords.some(kw => isPartialKeywordMatch(text, kw))) {
      return "partial";
    }
    return "none";
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;

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
                rowClassName = "bg-emerald-500/10";
                textClassName = "font-medium text-emerald-700 dark:text-emerald-400";
              } else if (matchType === "partial") {
                rowClassName = "bg-amber-500/10";
                textClassName = "font-medium text-amber-700 dark:text-amber-400";
              }

              return (
                <TableRow key={index} className={rowClassName}>
                  <TableCell className={textClassName}>
                    {keyword.text}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{wordCount}</Badge>
                  </TableCell>
                  <TableCell>{(keyword.relevance * 100).toFixed(1)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {targetKeywords.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            Exact match
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500/70" />
            Partial match
          </span>
        </div>
      )}
    </div>
  );
};

export default KeywordsTab;
