import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface ApiConfigPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  url: string;
  setUrl: (url: string) => void;
  region: string;
  setRegion: (region: string) => void;
  instanceId: string;
  setInstanceId: (id: string) => void;
  features: {
    keywords: boolean;
    entities: boolean;
    concepts: boolean;
    relations: boolean;
    categories: boolean;
    classifications: boolean;
    emotion: boolean;
    sentiment: boolean;
    semantic_roles: boolean;
    syntax: boolean;
  };
  setFeatures: (features: any) => void;
  limits: {
    keywords: number;
    entities: number;
    concepts: number;
    categories: number;
    semantic_roles: number;
  };
  setLimits: (limits: any) => void;
  language: string;
  setLanguage: (lang: string) => void;
  toneModel: string;
  setToneModel: (model: string) => void;
  credentialsFileExists?: boolean;
}

const regionOptions = {
  "us-south": "Dallas (us-south)",
  "us-east": "Washington DC (us-east)",
  "eu-de": "Frankfurt (eu-de)",
  "eu-gb": "London (eu-gb)",
  "au-syd": "Sydney (au-syd)",
  "jp-tok": "Tokyo (jp-tok)",
  "kr-seo": "Seoul (kr-seo)",
  "custom": "Custom",
};

const ApiConfigPanel: React.FC<ApiConfigPanelProps> = ({
  apiKey,
  setApiKey,
  url,
  setUrl,
  region,
  setRegion,
  instanceId,
  setInstanceId,
  features,
  setFeatures,
  limits,
  setLimits,
  language,
  setLanguage,
  toneModel,
  setToneModel,
  credentialsFileExists = false,
}) => {
  const handleFeatureChange = (feature: string, value: boolean) => {
    setFeatures({ ...features, [feature]: value });
  };
  
  const handleLimitChange = (feature: string, value: number) => {
    setLimits({ ...limits, [feature]: value });
  };
  
  const handleRegionChange = (value: string) => {
    setRegion(value);
    if (value !== "custom") {
      setUrl(`https://api.${value}.natural-language-understanding.watson.cloud.ibm.com/instances/`);
    }
  };
  
  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>API Configuration</span>
          {credentialsFileExists && (
            <div className="flex items-center text-green-500 ml-2">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">ibm-credentials.env found</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your IBM Watson NLU API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(regionOptions).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {region === "custom" ? (
            <div className="space-y-2">
              <Label htmlFor="custom-url">Custom API URL</Label>
              <Input
                id="custom-url"
                placeholder="Enter the full URL of your IBM Watson NLU instance"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="instance-id">Instance ID</Label>
              <Input
                id="instance-id"
                placeholder="Enter your IBM Watson NLU instance ID"
                value={instanceId}
                onChange={(e) => setInstanceId(e.target.value)}
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Analysis Features</h3>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Extraction</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="keywords"
                  checked={features.keywords}
                  onCheckedChange={(checked) => handleFeatureChange("keywords", checked)}
                />
                <Label htmlFor="keywords">Keywords</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="entities"
                  checked={features.entities}
                  onCheckedChange={(checked) => handleFeatureChange("entities", checked)}
                />
                <Label htmlFor="entities">Entities</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="concepts"
                  checked={features.concepts}
                  onCheckedChange={(checked) => handleFeatureChange("concepts", checked)}
                />
                <Label htmlFor="concepts">Concepts</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="relations"
                  checked={features.relations}
                  onCheckedChange={(checked) => handleFeatureChange("relations", checked)}
                />
                <Label htmlFor="relations">Relations</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Classification</h4>
            <div className="flex items-center space-x-2">
              <Switch
                id="categories"
                checked={features.categories}
                onCheckedChange={(checked) => handleFeatureChange("categories", checked)}
              />
              <Label htmlFor="categories">Categories</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Tone Analysis</h4>
            <div className="flex items-center space-x-2">
              <Switch
                id="classifications"
                checked={features.classifications}
                onCheckedChange={(checked) => handleFeatureChange("classifications", checked)}
              />
              <Label htmlFor="classifications">Tone Analysis</Label>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Emotion & Sentiment</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emotion"
                  checked={features.emotion}
                  onCheckedChange={(checked) => handleFeatureChange("emotion", checked)}
                />
                <Label htmlFor="emotion">Emotion Analysis</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="sentiment"
                  checked={features.sentiment}
                  onCheckedChange={(checked) => handleFeatureChange("sentiment", checked)}
                />
                <Label htmlFor="sentiment">Sentiment Analysis</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Advanced Analysis</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="semantic_roles"
                  checked={features.semantic_roles}
                  onCheckedChange={(checked) => handleFeatureChange("semantic_roles", checked)}
                />
                <Label htmlFor="semantic_roles">Semantic Roles</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="syntax"
                  checked={features.syntax}
                  onCheckedChange={(checked) => handleFeatureChange("syntax", checked)}
                />
                <Label htmlFor="syntax">Syntax Analysis</Label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Language</h3>
          <div className="space-y-2">
            <Label htmlFor="language">Analysis Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Limits</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="keywords-limit">Keywords</Label>
                <Input
                  id="keywords-limit"
                  type="number"
                  min="1"
                  max="50"
                  value={limits.keywords}
                  onChange={(e) => handleLimitChange("keywords", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="entities-limit">Entities</Label>
                <Input
                  id="entities-limit"
                  type="number"
                  min="1"
                  max="50"
                  value={limits.entities}
                  onChange={(e) => handleLimitChange("entities", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="concepts-limit">Concepts</Label>
                <Input
                  id="concepts-limit"
                  type="number"
                  min="1"
                  max="50"
                  value={limits.concepts}
                  onChange={(e) => handleLimitChange("concepts", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="categories-limit">Categories</Label>
                <Input
                  id="categories-limit"
                  type="number"
                  min="1"
                  max="50"
                  value={limits.categories}
                  onChange={(e) => handleLimitChange("categories", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="semantic_roles-limit">Semantic Roles</Label>
                <Input
                  id="semantic_roles-limit"
                  type="number"
                  min="1"
                  max="50"
                  value={limits.semantic_roles}
                  onChange={(e) => handleLimitChange("semantic_roles", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConfigPanel;
