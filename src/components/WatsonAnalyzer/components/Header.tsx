
import React from 'react';
import { Github, Wand2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Fix import path to include correct components folder
import { QuickCredentialsInput } from './config/QuickCredentialsInput';

// Update the import path
import CorsProxy from './CorsProxy';

// Import the hook to get credential state setters
import { useCredentialsConfig } from '../hooks/useCredentialsConfig';

interface HeaderProps {
  credentialsFileExists: boolean;
}

const Header: React.FC<HeaderProps> = ({ credentialsFileExists }) => {
  // Get the credential state setters from the hook
  const { setApiKey, setUrl, setRegion, setInstanceId, setCredentialsFileExists } = useCredentialsConfig();

  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="container max-w-7xl mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Wand2 className="h-6 w-6 mr-2 text-blue-500" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Watson Analyzer
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <QuickCredentialsInput 
            setApiKey={setApiKey}
            setUrl={setUrl}
            setRegion={setRegion}
            setInstanceId={setInstanceId}
            credentialsFileExists={credentialsFileExists}
            setCredentialsFileExists={setCredentialsFileExists}
          />
          <CorsProxy className="mr-2" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <a
                  href="https://github.com/oslabs-ai/watson-analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <Github className="h-5 w-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                View on GitHub
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
