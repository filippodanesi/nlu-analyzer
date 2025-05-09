
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

  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Text</TableHead>
            <TableHead>Relevance</TableHead>
            {keywords[0].sentiment && <TableHead>Sentiment</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((keyword: any, index: number) => {
            const hasTargetKeyword = containsTargetKeyword(keyword.text);
            return (
              <TableRow key={index} className={hasTargetKeyword ? "bg-green-500/10" : ""}>
                <TableCell className={`font-medium ${hasTargetKeyword ? "text-green-600" : ""}`}>
                  {keyword.text}
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
  );
};

export default KeywordsTab;
