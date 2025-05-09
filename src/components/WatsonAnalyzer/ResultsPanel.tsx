import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  ChevronDown,
  FileJson,
  Copy
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";

interface ResultsPanelProps {
  results: any;
  targetKeywords: string[];
  textStats: {
    wordCount: number;
    sentenceCount: number;
    charCount: number;
  };
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  targetKeywords,
  textStats,
}) => {
  const { toast } = useToast();
  const [isJsonOpen, setIsJsonOpen] = React.useState(false);

  if (!results) return null;

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(results, null, 2));
    toast({
      title: "Copied to clipboard",
      description: "JSON response has been copied to your clipboard",
    });
  };

  // Function to check if a string contains any target keywords
  const containsTargetKeyword = (text: string) => {
    if (!text || !targetKeywords.length) return false;
    const lowerText = text.toLowerCase();
    return targetKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  };

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Analysis Results</CardTitle>
        <CardDescription>
          Extracted information from your text
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Text Statistics */}
        <Card className="bg-secondary/30">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-xs uppercase font-semibold text-muted-foreground">Text Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Words</p>
                <p className="text-2xl font-mono">{textStats.wordCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Sentences</p>
                <p className="text-2xl font-mono">{textStats.sentenceCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Characters</p>
                <p className="text-2xl font-mono">{textStats.charCount}</p>
              </div>
            </div>
            {results.language && (
              <div className="pt-2">
                <Badge variant="outline">Language: {results.language.toUpperCase()}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Results Tabs */}
        <Tabs defaultValue="extraction" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="extraction">Extraction</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="linguistics">Linguistics</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          {/* Extraction Tab */}
          <TabsContent value="extraction" className="pt-4">
            <Tabs defaultValue="entities">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="entities">Entities</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="concepts">Concepts</TabsTrigger>
                <TabsTrigger value="relations">Relations</TabsTrigger>
              </TabsList>

              {/* Entities Tab */}
              <TabsContent value="entities" className="pt-4">
                {results.entities && results.entities.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Text</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Relevance</TableHead>
                          {results.entities[0].sentiment && <TableHead>Sentiment</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.entities.map((entity: any, index: number) => {
                          const hasTargetKeyword = containsTargetKeyword(entity.text);
                          return (
                            <TableRow key={index} className={hasTargetKeyword ? "bg-vercel-green/10" : ""}>
                              <TableCell className={`font-medium ${hasTargetKeyword ? "text-vercel-green" : ""}`}>
                                {entity.text}
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
                ) : (
                  <div className="flex items-center justify-center p-8 border rounded-md">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <AlertCircle size={16} />
                      <p>No entities found in the analyzed text.</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Keywords Tab */}
              <TabsContent value="keywords" className="pt-4">
                {results.keywords && results.keywords.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Text</TableHead>
                          <TableHead>Relevance</TableHead>
                          {results.keywords[0].sentiment && <TableHead>Sentiment</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.keywords.map((keyword: any, index: number) => {
                          const hasTargetKeyword = containsTargetKeyword(keyword.text);
                          return (
                            <TableRow key={index} className={hasTargetKeyword ? "bg-vercel-green/10" : ""}>
                              <TableCell className={`font-medium ${hasTargetKeyword ? "text-vercel-green" : ""}`}>
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
                ) : (
                  <div className="flex items-center justify-center p-8 border rounded-md">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <AlertCircle size={16} />
                      <p>No keywords found in the analyzed text.</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Concepts Tab */}
              <TabsContent value="concepts" className="pt-4">
                {results.concepts && results.concepts.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Text</TableHead>
                          <TableHead>Relevance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.concepts.map((concept: any, index: number) => {
                          const hasTargetKeyword = containsTargetKeyword(concept.text);
                          return (
                            <TableRow key={index} className={hasTargetKeyword ? "bg-vercel-green/10" : ""}>
                              <TableCell className={`font-medium ${hasTargetKeyword ? "text-vercel-green" : ""}`}>
                                {concept.text}
                              </TableCell>
                              <TableCell>{(concept.relevance * 100).toFixed(1)}%</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center p-8 border rounded-md">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <AlertCircle size={16} />
                      <p>No concepts found in the analyzed text.</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Relations Tab */}
              <TabsContent value="relations" className="pt-4">
                {results.relations && results.relations.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Elements</TableHead>
                          <TableHead>Sentence</TableHead>
                          <TableHead>Confidence</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.relations.map((relation: any, index: number) => {
                          const sentence = relation.sentence;
                          const hasTargetKeyword = containsTargetKeyword(sentence);
                          
                          // Extract entities involved
                          const relationArgs = relation.arguments?.map((arg: any) => {
                            const text = arg.text;
                            const entityType = arg.entities?.[0]?.type || "";
                            return `${text} (${entityType})`;
                          }).join(" → ") || "";

                          return (
                            <TableRow key={index} className={hasTargetKeyword ? "bg-vercel-green/10" : ""}>
                              <TableCell>{relation.type}</TableCell>
                              <TableCell>{relationArgs}</TableCell>
                              <TableCell className={hasTargetKeyword ? "text-vercel-green" : ""}>{sentence}</TableCell>
                              <TableCell>{(relation.score * 100).toFixed(1)}%</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center p-8 border rounded-md">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <AlertCircle size={16} />
                      <p>No relations found in the analyzed text.</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Classification Tab */}
          <TabsContent value="classification" className="pt-4">
            {results.categories && results.categories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.categories.map((category: any, index: number) => {
                    const hasTargetKeyword = containsTargetKeyword(category.label);
                    return (
                      <TableRow key={index} className={hasTargetKeyword ? "bg-vercel-green/10" : ""}>
                        <TableCell className={`font-medium ${hasTargetKeyword ? "text-vercel-green" : ""}`}>
                          {category.label}
                        </TableCell>
                        <TableCell>{(category.score * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center p-8 border rounded-md">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <AlertCircle size={16} />
                  <p>No categories found in the analyzed text.</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Other tabs */}
          <TabsContent value="linguistics" className="pt-4">
            <div className="flex items-center justify-center p-8 border rounded-md">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <AlertCircle size={16} />
                <p>To enable linguistic analysis, select the corresponding options.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="pt-4">
            <div className="flex items-center justify-center p-8 border rounded-md">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <AlertCircle size={16} />
                <p>To use custom models, configure the appropriate settings.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Raw JSON Response */}
        <Collapsible open={isJsonOpen} onOpenChange={setIsJsonOpen}>
          <div className="flex items-center justify-between py-2">
            <h3 className="text-sm font-medium">API Response</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                <ChevronDown className={`h-4 w-4 transition-transform ${isJsonOpen ? "transform rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="relative">
              <pre className="bg-secondary/30 p-4 rounded-md overflow-auto text-xs font-mono h-[300px]">
                {JSON.stringify(results, null, 2)}
              </pre>
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute top-2 right-2 h-8 flex items-center gap-1"
                onClick={copyJsonToClipboard}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileJson className="h-3.5 w-3.5" />
          IBM Watson Natural Language Understanding API Explorer
        </span>
        <span>v1.0.0</span>
      </CardFooter>
    </Card>
  );
};

export default ResultsPanel;
