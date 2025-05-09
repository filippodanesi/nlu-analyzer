
import React from 'react';
import { AlertCircle } from "lucide-react";

interface PlaceholderTabProps {
  message: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center p-8 border rounded-md">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <AlertCircle size={16} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default PlaceholderTab;
