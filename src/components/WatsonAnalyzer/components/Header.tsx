
import React from 'react';
import { Github, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from '../ThemeToggle';

interface HeaderProps {
  credentialsFileExists: boolean;
  hasWatsonEnvVars: boolean;
}

const Header: React.FC<HeaderProps> = ({ credentialsFileExists, hasWatsonEnvVars }) => {
  return (
    <header className="border-b border-border">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">IBM Watson Natural Language Understanding Analyzer</h1>
          {credentialsFileExists && (
            <div className="flex items-center text-green-500 ml-2" title="IBM Credentials File Found">
              <CheckCircle className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Credentials File Found</span>
            </div>
          )}
          {!credentialsFileExists && hasWatsonEnvVars && (
            <div className="flex items-center text-blue-500 ml-2" title="IBM Credentials from Environment">
              <Info className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Env Variables Found</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <a 
            href="https://github.com/filippodanesi/watson-insight-explorer" 
            target="_blank" 
            rel="noopener noreferrer" 
            title="Go to the GitHub repository"
          >
            <Button variant="outline" size="icon" className="rounded-full">
              <Github className="h-4 w-4" />
            </Button>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
