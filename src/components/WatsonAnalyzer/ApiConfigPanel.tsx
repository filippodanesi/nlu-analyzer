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
import { CheckCircle, Copy, Clipboard, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
    categories: boolean;
    classifications: boolean;
  };
  setFeatures: (features: any) => void;
  limits: {
    keywords: number;
    entities: number;
    concepts: number;
    categories: number;
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
  const [quickInput, setQuickInput] = useState("");

  const handleQuickInput = () => {
    try {
      // Try to parse as JSON first
      const data = JSON.parse(quickInput);
      if (data.apikey) setApiKey(data.apikey);
      if (data.url) {
        const url = new URL(data.url);
        const region = url.hostname.split('.')[1];
        setRegion(region);
        setUrl(data.url);
      }
      if (data.instance_id) setInstanceId(data.instance_id);
      toast.success("Credentials imported successfully");
    } catch {
      // If not JSON, try to parse as URL
      try {
        const url = new URL(quickInput);
        if (url.hostname.includes('natural-language-understanding')) {
          const region = url.hostname.split('.')[1];
          setRegion(region);
          setUrl(quickInput);
          toast.success("URL imported successfully");
        }
      } catch {
        toast.error("Invalid input format");
      }
    }
    setQuickInput("");
  };

  const handleSaveCredentials = () => {
    const credentials = {
      apiKey,
      url,
      region,
      instanceId
    };
    localStorage.setItem('watson_credentials', JSON.stringify(credentials));
    toast.success("Credentials saved locally");
  };

  const handleLoadCredentials = () => {
    const saved = localStorage.getItem('watson_credentials');
    if (saved) {
      const credentials = JSON.parse(saved);
      setApiKey(credentials.apiKey);
      setUrl(credentials.url);
      setRegion(credentials.region);
      setInstanceId(credentials.instanceId);
      toast.success("Credentials loaded from local storage");
    }
  };

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      
      let apiKey = '';
      let url = '';
      
      lines.forEach(line => {
        if (line.startsWith('NATURAL_LANGUAGE_UNDERSTANDING_APIKEY=')) {
          apiKey = line.split('=')[1].trim();
        }
        if (line.startsWith('NATURAL_LANGUAGE_UNDERSTANDING_URL=')) {
          url = line.split('=')[1].trim();
        }
      });

      if (apiKey && url) {
        setApiKey(apiKey);
        const urlObj = new URL(url);
        const region = urlObj.hostname.split('.')[1];
        setRegion(region);
        setUrl(url);
        setInstanceId(url.split('/').pop() || '');
        toast.success("Credentials imported successfully");
      } else {
        toast.error("Invalid .env file format");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full bg-background border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>API Configuration</span>
          <div className="flex items-center gap-2">
            {credentialsFileExists && (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">ibm-credentials.env found</span>
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                accept=".env"
                onChange={handleFileUpload}
                className="hidden"
                id="env-upload"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('env-upload')?.click()}
                className="h-8"
              >
                <Upload className="h-4 w-4 mr-1" />
                <span className="text-xs">Import .env</span>
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="space-y-2">
            <Label>Quick Input</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Paste API URL or JSON credentials"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
              />
              <Button onClick={handleQuickInput}>
                <Clipboard className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>
          </div>

          <Separator />

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
                <SelectItem value="auto">Auto-detect</SelectItem>
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConfigPanel;
