
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Import custom components
import { ApiKeySection } from './components/config/ApiKeySection';
import { FeaturesSection } from './components/config/FeaturesSection';
import { LimitsSection } from './components/config/LimitsSection';
import { LanguageSection } from './components/config/LanguageSection';
import { ToneModelSection } from './components/config/ToneModelSection';
import { QuickCredentialsInput } from './components/config/QuickCredentialsInput';

import ProviderSelector from "./components/config/ProviderSelector";
import GoogleNlpConfig from "./components/config/GoogleNlpConfig";
import { useAnalysisProvider } from "./hooks/useAnalysisProvider";
import { useGoogleNlpConfig } from "./hooks/useGoogleNlpConfig";

interface ApiConfigPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  url: string;
  setUrl: (url: string) => void;
  region: string;
  setRegion: (region: string) => void;
  instanceId: string;
  setInstanceId: (id: string) => void;
  features: any;
  setFeatures: (features: any) => void;
  limits: any;
  setLimits: (limits: any) => void;
  language: string;
  setLanguage: (language: string) => void;
  toneModel: string;
  setToneModel: (toneModel: string) => void;
  credentialsFileExists: boolean;
  setCredentialsFileExists: (exists: boolean) => void;
  provider: any;
  setProvider: (provider: any) => void;
  googleApiKey: string;
  setGoogleApiKey: (key: string) => void;
}

const ApiConfigPanel = ({
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
  credentialsFileExists,
  setCredentialsFileExists,
  provider,
  setProvider,
  googleApiKey,
  setGoogleApiKey
}) => {
  const {
    isWatson,
    isGoogle
  } = useAnalysisProvider();

  // Google NLP configuration
  const googleConfig = useGoogleNlpConfig();

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">API Configuration</CardTitle>
        <CardDescription>
          Configure APIs for natural language analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Provider selector */}
        <ProviderSelector 
          provider={provider}
          setProvider={setProvider}
        />
        
        <Separator />
        
        {/* IBM Watson configuration */}
        {isWatson && (
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center py-2 cursor-pointer">
                <h3 className="text-sm font-medium">IBM Watson NLU</h3>
                <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2 pb-4">
                <ApiKeySection
                  apiKey={apiKey}
                  setApiKey={setApiKey}
                  region={region}
                  setRegion={setRegion}
                  url={url}
                  setUrl={setUrl}
                  instanceId={instanceId}
                  setInstanceId={setInstanceId}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Google NLP configuration */}
        {isGoogle && (
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center py-2 cursor-pointer">
                <h3 className="text-sm font-medium">Google Cloud NLP</h3>
                <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2 pb-4">
                <GoogleNlpConfig
                  apiKey={googleConfig.apiKey}
                  setApiKey={googleConfig.setApiKey}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Analysis Features Section */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center py-2 cursor-pointer">
              <h3 className="text-sm font-medium">Analysis Features</h3>
              <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 pb-4">
              <FeaturesSection
                features={features}
                setFeatures={setFeatures}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Limits Section */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center py-2 cursor-pointer">
              <h3 className="text-sm font-medium">Limits</h3>
              <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 pb-4">
              <LimitsSection
                limits={limits}
                setLimits={setLimits}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Language Section */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center py-2 cursor-pointer">
              <h3 className="text-sm font-medium">Language</h3>
              <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 pb-4">
              <LanguageSection
                language={language}
                setLanguage={setLanguage}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Tone Model Section */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center py-2 cursor-pointer">
              <h3 className="text-sm font-medium">Tone Model</h3>
              <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 pb-4">
              <ToneModelSection
                toneModel={toneModel}
                setToneModel={setToneModel}
                provider={provider}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Quick Credentials Input */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <div className="flex justify-between items-center py-2 cursor-pointer">
              <h3 className="text-sm font-medium">Load Credentials</h3>
              <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 pb-4">
              <QuickCredentialsInput
                setApiKey={setApiKey}
                setUrl={setUrl}
                setRegion={setRegion}
                setInstanceId={setInstanceId}
                setCredentialsFileExists={setCredentialsFileExists}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
      </CardContent>
    </Card>
  );
};

export default ApiConfigPanel;
