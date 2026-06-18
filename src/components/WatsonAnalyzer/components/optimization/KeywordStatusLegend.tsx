
import React from 'react';
import { KEYWORD_STATUS_META, KEYWORD_STATUS_ORDER } from './keywordStatusMeta';

/**
 * Compact legend explaining the three keyword states.
 */
const KeywordStatusLegend: React.FC = () => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
    {KEYWORD_STATUS_ORDER.map((status) => {
      const { label, Icon } = KEYWORD_STATUS_META[status];
      return (
        <span key={status} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {label}
        </span>
      );
    })}
  </div>
);

export default KeywordStatusLegend;
