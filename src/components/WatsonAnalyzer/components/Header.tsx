
import React from 'react';
import { CheckCircle } from "lucide-react";

interface HeaderProps {
  credentialsFileExists: boolean;
}

const Header: React.FC<HeaderProps> = ({ credentialsFileExists }) => {
  return (
    <header className="border-b">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">IBM Watson Natural Language Understanding Analyzer</h1>
        {credentialsFileExists && (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">ibm-credentials.env found</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
