
import React from 'react';
import { AlertCircle, Info, ExternalLink } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EntitiesTabProps {
  entities: any[];
  containsTargetKeyword: (text: string) => boolean;
}

const EntitiesTab: React.FC<EntitiesTabProps> = ({ entities, containsTargetKeyword }) => {
  const [isNerInfoOpen, setIsNerInfoOpen] = React.useState(false);
  const [isEntityTypesOpen, setIsEntityTypesOpen] = React.useState(false);
  
  if (!entities || entities.length === 0) {
    return (
      <div className="space-y-4">
        <EntityInfoSection 
          isNerInfoOpen={isNerInfoOpen}
          setIsNerInfoOpen={setIsNerInfoOpen}
          isEntityTypesOpen={isEntityTypesOpen}
          setIsEntityTypesOpen={setIsEntityTypesOpen}
        />
        <div className="flex items-center justify-center p-8 border rounded-md">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <AlertCircle size={16} />
            <p>No entities found in the analyzed text.</p>
          </div>
        </div>
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited entity detection</AlertTitle>
          <AlertDescription>
            Try incorporating more specific named entities in your text, such as people (John Smith), 
            organizations (Microsoft), locations (Paris), dates (January 2023), etc. IBM Watson can detect 
            over 100 different entity types, but they need to be clearly present in the text.
          </AlertDescription>
        </Alert>
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
      <EntityInfoSection 
        isNerInfoOpen={isNerInfoOpen}
        setIsNerInfoOpen={setIsNerInfoOpen}
        isEntityTypesOpen={isEntityTypesOpen}
        setIsEntityTypesOpen={setIsEntityTypesOpen}
      />

      {entities.length <= 5 && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited entity detection</AlertTitle>
          <AlertDescription>
            Only {entities.length} {entities.length === 1 ? 'entity was' : 'entities were'} detected. 
            Try including more diverse named entities in your text like people, organizations, locations, 
            dates, etc. Consider increasing the entity limit in the configuration panel.
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

const EntityInfoSection: React.FC<{
  isNerInfoOpen: boolean;
  setIsNerInfoOpen: (open: boolean) => void;
  isEntityTypesOpen: boolean;
  setIsEntityTypesOpen: (open: boolean) => void;
}> = ({ isNerInfoOpen, setIsNerInfoOpen, isEntityTypesOpen, setIsEntityTypesOpen }) => {
  return (
    <>
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
          <p className="mb-2">
            When IBM Watson processes text like "Rita is an IBM employee based in London", it automatically recognizes 
            "Rita" as a person, "IBM" as an organization, and "London" as a location. This helps structure unstructured 
            text data for better search, recommendations, and analytics.
          </p>
          <div className="mt-3 pt-3 border-t border-border">
            <h4 className="font-medium mb-2">Example of NER in action:</h4>
            <div className="bg-primary/5 p-3 rounded-md font-mono text-sm">
              <p>
                <span className="bg-blue-100 px-1 rounded">Rita</span> is an 
                <span className="bg-green-100 px-1 rounded ml-1">IBM</span> employee based in 
                <span className="bg-amber-100 px-1 rounded ml-1">London</span>.
              </p>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="bg-blue-100 px-1 rounded">Person</span>
                <span className="bg-green-100 px-1 rounded">Organization</span>
                <span className="bg-amber-100 px-1 rounded">Location</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isEntityTypesOpen} onOpenChange={setIsEntityTypesOpen} className="border rounded-md p-4 bg-muted/30">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center justify-between w-full text-left">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-muted-foreground" />
              <span className="font-medium">IBM Watson Entity Types</span>
            </div>
            {isEntityTypesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
          <p className="mb-3">
            IBM Watson NLU can detect over 100 different entity types and subtypes. Here are some of the main entity types:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Badge variant="outline" className="justify-center">Date</Badge>
            <Badge variant="outline" className="justify-center">Duration</Badge>
            <Badge variant="outline" className="justify-center">EmailAddress</Badge>
            <Badge variant="outline" className="justify-center">Facility</Badge>
            <Badge variant="outline" className="justify-center">GeographicFeature</Badge>
            <Badge variant="outline" className="justify-center">JobTitle</Badge>
            <Badge variant="outline" className="justify-center">Location</Badge>
            <Badge variant="outline" className="justify-center">Measure</Badge>
            <Badge variant="outline" className="justify-center">Money</Badge>
            <Badge variant="outline" className="justify-center">Number</Badge>
            <Badge variant="outline" className="justify-center">Organization</Badge>
            <Badge variant="outline" className="justify-center">Person</Badge>
            <Badge variant="outline" className="justify-center">Percent</Badge>
            <Badge variant="outline" className="justify-center">PhoneNumber</Badge>
            <Badge variant="outline" className="justify-center">Time</Badge>
            <Badge variant="outline" className="justify-center">URL</Badge>
          </div>
          <p className="mt-3 text-xs">
            <a 
              href="https://cloud.ibm.com/docs/natural-language-understanding?topic=natural-language-understanding-entity-types" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              View full list at IBM docs <ExternalLink size={12} />
            </a>
          </p>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default EntitiesTab;
