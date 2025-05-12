
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface KeywordStatusBadgeProps {
  keyword: string;
  status: {
    exact: boolean;
    partial: boolean;
  };
}

/**
 * Displays a keyword with a visual indicator of its match status
 */
const KeywordStatusBadge: React.FC<KeywordStatusBadgeProps> = ({ keyword, status }) => {
  let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
  let badgeClass = "";
  let indicator = "✗";
  
  if (status.exact) {
    badgeVariant = "outline";
    badgeClass = "bg-green-100 text-green-800";
    indicator = "✓";
  } else if (status.partial) {
    badgeVariant = "outline";
    badgeClass = "bg-amber-100 text-amber-800";
    indicator = "~";
  } else {
    badgeClass = "bg-red-100 text-red-800";
  }
  
  return (
    <Badge 
      variant={badgeVariant}
      className={badgeClass}
    >
      {keyword} {indicator}
    </Badge>
  );
};

export default KeywordStatusBadge;
