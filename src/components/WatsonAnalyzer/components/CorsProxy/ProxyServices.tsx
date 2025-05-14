
import React from 'react';
import { ExternalLink } from "lucide-react";

export const ProxyServices: React.FC = () => {
  return (
    <div className="text-xs text-muted-foreground mt-4">
      <p>
        Recommended CORS proxy services:
      </p>
      <ul className="list-disc list-inside mt-1 space-y-1">
        <li>
          <a 
            href="https://cors.sh/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:underline font-medium"
          >
            cors.sh (Recommended)
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </li>
        <li>
          <a 
            href="https://corsproxy.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:underline"
          >
            corsproxy.io
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </li>
        <li>
          <a 
            href="https://api.allorigins.win/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:underline"
          >
            api.allorigins.win
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </li>
        <li>
          <a 
            href="https://github.com/Rob--W/cors-anywhere" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center hover:underline"
          >
            Run your own proxy
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </li>
      </ul>
    </div>
  );
};
