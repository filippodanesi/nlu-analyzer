
import React from 'react';
import { CheckCircle, Info } from "lucide-react";

interface EnvironmentCredentialsPanelProps {
  credentialsFileExists: boolean;
  hasWatsonEnvVars: boolean;
}

const EnvironmentCredentialsPanel: React.FC<EnvironmentCredentialsPanelProps> = ({
  credentialsFileExists,
  hasWatsonEnvVars
}) => {
  return (
    <div className="px-4 py-3 bg-secondary text-secondary-foreground rounded-md text-sm">
      <p>Using Watson NLU credentials from {credentialsFileExists ? 'ibm-credentials.env' : 'environment variables'}:</p>
      <ul className="list-disc ml-5 mt-2 text-xs space-y-1">
        <li>NATURAL_LANGUAGE_UNDERSTANDING_APIKEY</li>
        <li>NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY</li>
        <li>NATURAL_LANGUAGE_UNDERSTANDING_URL</li>
        <li>NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE</li>
      </ul>
      <p className="mt-2 text-xs italic">
        {credentialsFileExists ? 
          "Credentials from file have higher priority than environment variables." : 
          "You can also set these variables in your hosting provider (like Vercel) for production."}
      </p>
    </div>
  );
};

export default EnvironmentCredentialsPanel;
