
import React from 'react';
import { Badge } from "@/components/ui/badge";
import type { KeywordStatus } from '../../hooks/useTextOptimization';
import { KEYWORD_STATUS_META } from './keywordStatusMeta';

interface KeywordStatusBadgeProps {
  keyword: string;
  status: KeywordStatus;
}

/**
 * Shows a target keyword with a clear indicator of whether it appears in the text.
 */
const KeywordStatusBadge: React.FC<KeywordStatusBadgeProps> = ({ keyword, status }) => {
  const { className, Icon } = KEYWORD_STATUS_META[status];

  return (
    <Badge variant="outline" className={`gap-1 font-medium ${className}`}>
      <span>{keyword}</span>
      <Icon className="h-3 w-3" />
    </Badge>
  );
};

export default KeywordStatusBadge;
