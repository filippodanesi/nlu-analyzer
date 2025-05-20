
import React from 'react';
import { 
  Input 
} from "@/components/ui/input";
import { 
  Label 
} from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GoogleNlpConfigProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const GoogleNlpConfig: React.FC<GoogleNlpConfigProps> = ({
  apiKey,
  setApiKey,
}) => {
  return (
    <div className="space-y-4">
      <Alert variant="info" className="bg-secondary/30">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          To use Google Cloud NLP API, you need to create a project on Google Cloud Platform and enable the Natural Language API.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="google-api-key">Google Cloud API Key</Label>
        <Input
          id="google-api-key"
          type="password"
          placeholder="Enter your Google Cloud API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
    </div>
  );
};

export default GoogleNlpConfig;
