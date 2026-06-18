
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Filter, Eye, EyeOff } from "lucide-react";
import EntityTable from './Entities/EntityTable';
import EntityStatsDisplay from './Entities/EntityStatsDisplay';
import EntityAlerts from './Entities/EntityAlerts';
import EmptyEntitiesState from './Entities/EmptyEntitiesState';
import DomainEntitiesSection from './Entities/DomainEntitiesSection';
import { countWords, getMultiWordEntitiesCount } from './Entities/entityUtils';
import { Separator } from "@/components/ui/separator";

interface EntitiesTabProps {
  entities: any[];
  containsTargetKeyword: (text: string) => boolean;
  text: string;
}

const EntitiesTab: React.FC<EntitiesTabProps> = ({ entities, containsTargetKeyword, text }) => {
  const [showLowConfidence, setShowLowConfidence] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const hasEntities = !!entities && entities.length > 0;

  // Get entity types for filtering
  const entityTypes = [...new Set((entities || []).map(entity => entity.type))].sort();
  
  // Calculate stats
  const totalEntityCount = entities.length;
  const entityTypeCount = entityTypes.length;
  const multiWordEntitiesCount = getMultiWordEntitiesCount(entities);
  
  // Filter entities based on confidence and type selection
  const filteredEntities = entities.filter(entity => {
    const passesConfidenceFilter = showLowConfidence || (entity.confidence && entity.confidence > 0.5);
    const passesTypeFilter = selectedTypes.length === 0 || selectedTypes.includes(entity.type);
    return passesConfidenceFilter && passesTypeFilter;
  });

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      <DomainEntitiesSection text={text} />

      <Separator />

      {!hasEntities ? (
        <EmptyEntitiesState />
      ) : (
      <div className="space-y-4">
      {/* Entity Statistics */}
      <EntityStatsDisplay
        entityTypes={entityTypes}
        entities={entities}
        totalEntityCount={totalEntityCount}
        entityTypeCount={entityTypeCount}
        multiWordEntitiesCount={multiWordEntitiesCount}
      />

      {/* Alerts for potential issues */}
      <EntityAlerts 
        entities={entities}
        entityTypeCount={entityTypeCount}
        totalEntityCount={totalEntityCount}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant={showLowConfidence ? "default" : "outline"}
          size="sm"
          onClick={() => setShowLowConfidence(!showLowConfidence)}
          className="h-7 px-2"
        >
          {showLowConfidence ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
          Low confidence
        </Button>
        
        <div className="flex flex-wrap gap-1">
          {entityTypes.map(type => (
            <Button
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTypeFilter(type)}
              className="h-7 px-2 text-xs"
            >
              {type}
            </Button>
          ))}
        </div>
        
        {selectedTypes.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTypes([])}
            className="h-7 px-2 text-xs text-muted-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Entity Table */}
      <EntityTable 
        entities={filteredEntities}
        containsTargetKeyword={containsTargetKeyword}
        countWords={countWords}
      />

      {filteredEntities.length === 0 && entities.length > 0 && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          No entities match the current filters. Try adjusting your filter settings.
        </p>
      )}
      </div>
      )}
    </div>
  );
};

export default EntitiesTab;
