
import React from 'react';
import { Info, AlertTriangle } from "lucide-react";

interface ProxyInfoBoxesProps {
  currentProxyUrl: string;
}

export const ProxyInfoBoxes: React.FC<ProxyInfoBoxesProps> = ({ currentProxyUrl }) => {
  return (
    <>
      <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
        <p className="text-amber-800 dark:text-amber-300 text-xs flex items-start">
          <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Important:</strong> Anthropic API requires special headers that may not work with all proxies.
            If you experience issues with Claude optimization, try these alternatives:
            <ul className="list-disc pl-5 mt-1">
              <li>Use OpenAI models instead (GPT-4o works well)</li>
              <li>Try different CORS proxies like corsproxy.io or allorigins.win</li>
              <li>Set up a simple backend service for API calls</li>
            </ul>
          </span>
        </p>
      </div>
      
      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
        <p className="text-blue-800 dark:text-blue-300 text-xs flex items-center">
          <Info className="h-4 w-4 mr-1" />
          <strong>Current active proxy:</strong> {currentProxyUrl || "Default (cors.sh)"}
        </p>
      </div>
    </>
  );
};
