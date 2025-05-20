
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EntitiesTabProps {
  entities: any[];
  containsTargetKeyword: (text: string) => boolean;
}

const EntitiesTab: React.FC<EntitiesTabProps> = ({ entities, containsTargetKeyword }) => {
  const [isNerInfoOpen, setIsNerInfoOpen] = React.useState(false);
  
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

  // Group entities by type for better visualization
  const entityTypes = [...new Set(entities.map(entity => entity.type))];
  
  // Calculate some statistics for entities detection
  const totalEntityCount = entities.length;
  const entityTypeCount = entityTypes.length;
  const multiWordEntitiesCount = entities.filter(entity => entity.text.includes(' ')).length;

  return (
    <div className="space-y-4">
      <Collapsible open={isNerInfoOpen} onOpenChange={setIsNerInfoOpen} className="border rounded-md p-4 bg-muted/30">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center justify-between w-full text-left">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-muted-foreground" />
              <span className="font-medium">About Named Entity Recognition (NER)</span>
            </div>
            {isNerInfoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
          <p className="mb-2">
            Named Entity Recognition (NER) identifies and categorizes key elements in text into predefined categories 
            such as people, organizations, locations, dates, and more.
          </p>
          <p>
            When IBM Watson processes text like "Rita is an IBM employee based in London", it automatically recognizes 
            "Rita" as a person, "IBM" as an organization, and "London" as a location. This helps structure unstructured 
            text data for better search, recommendations, and analytics.
          </p>
        </CollapsibleContent>
      </Collapsible>

      {entities.length <= 2 && (
        <Alert variant="info" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only {entities.length} {entities.length === 1 ? 'entity was' : 'entities were'} detected. Try using more specific named entities 
            in your text (like people, organizations, locations, dates, etc.) to improve entity recognition.
          </AlertDescription>
        </Alert>
      )}

      {entityTypeCount === 1 && totalEntityCount > 1 && (
        <Alert variant="info" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            All detected entities are of the same type ({entityTypes[0]}). Consider diversifying your text with different 
            entity types for more comprehensive analysis.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-3">
        <h3 className="text-sm font-medium mb-2">Entity Types Distribution</h3>
        <div className="flex flex-wrap gap-2">
          {entityTypes.map(type => (
            <Badge key={type} variant="outline" className="bg-secondary">
              {type}: {entities.filter(e => e.type === type).length}
            </Badge>
          ))}
        </div>
      </div>
      
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Text</TableHead>
              <TableHead className="w-1/6">Type</TableHead>
              <TableHead className="w-1/6">Confidence</TableHead>
              <TableHead className="w-1/6">Relevance</TableHead>
              <TableHead className="w-1/6">Count</TableHead>
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
                    {wordCount > 1 && (
                      <Badge variant="outline" className="ml-2 bg-blue-500/10 text-xs">
                        {wordCount} words
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50">
                      {entity.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{entity.confidence ? (entity.confidence * 100).toFixed(1) + '%' : 'N/A'}</TableCell>
                  <TableCell>{(entity.relevance * 100).toFixed(1)}%</TableCell>
                  <TableCell>{entity.count}</TableCell>
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
