
import React from 'react';
import { AlertCircle } from "lucide-react";

interface EntityAlertsProps {
  entities: any[];
  entityTypeCount: number;
  totalEntityCount: number;
}

/**
 * Quiet, contextual hints about the entity results. Only surfaces a note when
 * detection looks thin — no permanent onboarding banners.
 */
const EntityAlerts: React.FC<EntityAlertsProps> = ({ entities }) => {
  if (entities.length > 5) return null;

  return (
    <p className="flex items-start gap-2 text-xs text-muted-foreground">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      Only {entities.length} {entities.length === 1 ? 'entity was' : 'entities were'} detected. Watson's
      general model recognises people, organisations, locations and dates — add more named entities, or
      raise the entity limit in the configuration panel.
    </p>
  );
};

export default EntityAlerts;
