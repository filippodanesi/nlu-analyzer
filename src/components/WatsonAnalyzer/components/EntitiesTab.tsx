
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

interface EntitiesTabProps {
  entities: any[];
  containsTargetKeyword: (text: string) => boolean;
}

const EntitiesTab: React.FC<EntitiesTabProps> = ({ entities, containsTargetKeyword }) => {
  const [showLowConfidence, setShowLowConfidence] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  if (!entities || entities.length === 0) {
    return <EmptyEntitiesState />;
  }

  // Get entity types for filtering
  const entityTypes = [...new Set(entities.map(entity => entity.type))].sort();
  
  // Filter entities based on confidence and type selection
  const filteredEntities = entities.filter(entity => {
    const passesConfidenceFilter = showLowConfidence || (entity.confidence && entity.confidence > 0.5);
    const passesTypeFilter = selectedTypes.length === 0 || selectedTypes.includes(entity.type);
    return passesConfidenceFilter && passesTypeFilter;
  });

  // Check for potential issues with entity recognition
  const hasMultiWordIssues = entities.some(entity => {
    const text = entity.text || '';
    const type = entity.type || '';
    
    if (text.includes(' ') && ['Organization', 'Company', 'Brand'].includes(type)) {
      const words = text.split(' ');
      const firstWord = words[0].toLowerCase();
      const commonVerbs = ['experience', 'discover', 'buy', 'shop', 'find', 'get', 'try'];
      return commonVerbs.includes(firstWord);
    }
    return false;
  });

  const hasSectionTitleIssues = entities.some(entity => 
    entity.type === 'Organization' && 
    (entity.text.includes('of ') || entity.text.includes('The ') || entity.text.length > 20)
  );

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="space-y-4">
      {/* Entity Statistics */}
      <EntityStatsDisplay entities={entities} />

      {/* Alerts for potential issues */}
      <EntityAlerts 
        hasMultiWordIssues={hasMultiWordIssues}
        hasSectionTitleIssues={hasSectionTitleIssues}
        entities={entities}
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
      />

      {filteredEntities.length === 0 && entities.length > 0 && (
        <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No entities match the current filters. Try adjusting your filter settings.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EntitiesTab;
