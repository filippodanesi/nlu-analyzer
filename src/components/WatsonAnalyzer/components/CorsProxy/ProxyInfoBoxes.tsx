
import React from 'react';
import { Info } from "lucide-react";

interface ProxyInfoBoxesProps {
  currentProxyUrl: string;
}

export const ProxyInfoBoxes: React.FC<ProxyInfoBoxesProps> = ({ currentProxyUrl }) => {
  return (
    <>
      <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
        <p className="text-amber-800 dark:text-amber-300 text-xs">
          <strong>Important:</strong> Anthropic now requires the <code>anthropic-dangerous-direct-browser-access</code> header
          for browser-based API calls. This application adds this header automatically.
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
