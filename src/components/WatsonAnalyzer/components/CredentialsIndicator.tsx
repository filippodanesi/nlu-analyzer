
import React from 'react';
import { CheckCircle, Info } from "lucide-react";

interface CredentialsIndicatorProps {
  credentialsFileExists: boolean;
  hasWatsonEnvVars: boolean;
}

const CredentialsIndicator: React.FC<CredentialsIndicatorProps> = ({ 
  credentialsFileExists, 
  hasWatsonEnvVars 
}) => {
  if (credentialsFileExists) {
    return (
      <div className="flex items-center text-green-500 ml-2">
        <CheckCircle className="h-4 w-4 mr-1" />
        <span className="text-xs">ibm-credentials.env found</span>
      </div>
    );
  }
  
  if (hasWatsonEnvVars) {
    return (
      <div className="flex items-center text-blue-500 ml-2">
        <Info className="h-4 w-4 mr-1" />
        <span className="text-xs">environment variables found</span>
      </div>
    );
  }
  
  return null;
};

export default CredentialsIndicator;
