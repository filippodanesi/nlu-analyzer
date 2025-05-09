
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

interface EntitiesTabProps {
  entities: any[];
  containsTargetKeyword: (text: string) => boolean;
}

const EntitiesTab: React.FC<EntitiesTabProps> = ({ entities, containsTargetKeyword }) => {
  if (!entities || entities.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-md">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <AlertCircle size={16} />
          <p>No entities found in the analyzed text.</p>
        </div>
      </div>
    );
  }

  // Check if there are any multi-word entities
  const hasMultiWordEntities = entities.some(entity => entity.text.includes(' '));
  
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
              <TableHead className="w-1/3">Text</TableHead>
              <TableHead>Words</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Relevance</TableHead>
              {entities[0].sentiment && <TableHead>Sentiment</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.map((entity: any, index: number) => {
              const hasTargetKeyword = containsTargetKeyword(entity.text);
              const wordCount = countWords(entity.text);
              return (
                <TableRow key={index} className={hasTargetKeyword ? "bg-green-500/10" : ""}>
                  <TableCell className={`font-medium ${hasTargetKeyword ? "text-green-600" : ""}`}>
                    {entity.text}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50">
                      {wordCount}
                    </Badge>
                  </TableCell>
                  <TableCell>{entity.type}</TableCell>
                  <TableCell>{(entity.relevance * 100).toFixed(1)}%</TableCell>
                  {entity.sentiment && (
                    <TableCell>
                      <Badge 
                        variant={entity.sentiment.score > 0 ? "default" : entity.sentiment.score < 0 ? "destructive" : "outline"}
                      >
                        {entity.sentiment.score.toFixed(2)}
                      </Badge>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
      
    </div>
  );
};

export default EntitiesTab;
