
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from '@/components/WatsonAnalyzer/components/Footer';

// Helper function to get badge variant based on feature type
const getFeatureTypeVariant = (feature: string) => {
  if (feature.startsWith("FIX")) return "destructive";
  if (feature.startsWith("ENHANCEMENT") || feature.startsWith("ENHANCE")) return "secondary";
  if (feature.startsWith("IMPLEMENT")) return "default";
  if (feature.startsWith("MAJOR")) return "outline";
  if (feature.startsWith("UPDATE")) return "secondary";
  return "default";
};

// Helper to determine version badge variant
const getVersionBadgeVariant = (features: string[]) => {
  if (features.some(f => f.startsWith("MAJOR"))) return "destructive";
  if (features.some(f => f.startsWith("FIX"))) return "outline";
  if (features.some(f => f.startsWith("ENHANCEMENT") || f.startsWith("ENHANCE"))) return "secondary";
  if (features.some(f => f.startsWith("IMPLEMENT"))) return "default";
  return "default";
};

const Changelog: React.FC = () => {
  const versions = [
    {
      version: "1.1.6",
      date: "May 20, 2025",
      features: [
        "ENHANCEMENT: Improved entity detection visualization with type grouping",
        "ENHANCEMENT: Added alerts for low entity detection",
        "FIX: Added info variant to Alert component",
        "IMPLEMENT: Enabled tone analysis by default",
        "ENHANCE: Increased default keyword limit to 20"
      ]
    },
    {
      version: "1.1.5",
      date: "May 20, 2025",
      features: [
        "FIX: Fixed import errors in useOptimizationProcess.ts",
        "FIX: Corrected import paths for optimization modules",
        "ENHANCEMENT: Improved error handling for AI models"
      ]
    },
    {
      version: "1.1.4",
      date: "May 19, 2025",
      features: [
        "ENHANCEMENT: Enhanced product entity identification in text analysis",
        "ENHANCEMENT: Improved keyword matching in optimized texts",
        "ENHANCEMENT: Enhanced entity recognition in optimized text"
      ]
    },
    {
      version: "1.1.3",
      date: "May 18, 2025",
      features: [
        "FIX: Fixed issue with o4-mini model",
        "UPDATE: Updated openAiUtils.ts to use max_completion_tokens instead of max_tokens",
        "ENHANCEMENT: Improved AI model-specific error messages"
      ]
    },
    {
      version: "1.1.2",
      date: "May 17, 2025",
      features: [
        "ENHANCEMENT: Optimized user interface for text analysis",
        "ENHANCEMENT: Enhanced user experience in the results panel",
        "ENHANCEMENT: Refined keyword recognition system"
      ]
    },
    {
      version: "1.1.1",
      date: "May 16, 2025",
      features: [
        "IMPLEMENT: Added support for additional languages in tone analysis",
        "ENHANCEMENT: Improved entity processing algorithm",
        "ENHANCEMENT: Optimized performance for analyzing long texts"
      ]
    },
    {
      version: "1.1.0",
      date: "May 15, 2025",
      features: [
        "MAJOR: Added text optimization functionality with AI",
        "IMPLEMENT: Implemented support for OpenAI and Claude",
        "IMPLEMENT: Integrated cost monitoring for AI APIs"
      ]
    },
    {
      version: "1.0.0",
      date: "May 14, 2025",
      features: [
        "MAJOR: Initial application release",
        "IMPLEMENT: Implemented basic interface for text analysis",
        "IMPLEMENT: Integrated with IBM Watson Natural Language Understanding API",
        "IMPLEMENT: Added support for keywords, entities, concepts, and categories analysis"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold">Changelog</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-5xl mx-auto px-4 py-8 flex-grow">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              Update History and Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              This changelog tracks all updates and improvements made to the IBM Watson Natural Language Understanding Analyzer over time.
            </p>
            
            <div className="space-y-8">
              {versions.map((version, index) => (
                <div key={version.version} className="relative">
                  {/* Timeline connector */}
                  {index < versions.length - 1 && (
                    <div className="absolute left-[9px] top-10 w-0.5 h-[calc(100%-24px)] bg-border"></div>
                  )}
                  
                  <div className="flex gap-4">
                    {/* Timeline bullet */}
                    <div className="relative w-5 h-5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">Version {version.version}</h3>
                        <Badge variant={getVersionBadgeVariant(version.features)}>
                          {version.features.some(f => f.startsWith("MAJOR")) 
                            ? "MAJOR" 
                            : version.features.some(f => f.startsWith("FIX")) 
                              ? "FIX" 
                              : "IMPROVE"}
                        </Badge>
                        <Badge variant="outline">{version.date}</Badge>
                      </div>
                      
                      <ul className="list-disc list-inside pl-2 space-y-1">
                        {version.features.map((feature, idx) => (
                          <li key={idx} className="text-muted-foreground">
                            <Badge 
                              variant={getFeatureTypeVariant(feature)}
                              className="mr-2 px-1 py-0 text-xs font-normal"
                            >
                              {feature.split(":")[0]}
                            </Badge>
                            {feature.split(": ")[1]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-muted rounded-lg p-6 text-center">
          <h3 className="font-medium mb-2">Upcoming Features</h3>
          <p className="text-muted-foreground">
            We're working on new features to enhance the text analysis and optimization experience.
            Stay tuned for upcoming versions!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Changelog;
