
import React from 'react';
import EntityTable from './Entities/EntityTable';
import EntityAlerts from './Entities/EntityAlerts';
import EntityStatsDisplay from './Entities/EntityStatsDisplay';
import EmptyEntitiesState from './Entities/EmptyEntitiesState';
import { 
  countWords,
  getEntityTypes,
  getMultiWordEntitiesCount
} from './Entities/entityUtils';

interface EntitiesTabProps {
  entities: any[];
  containsTargetKeyword: (text: string) => boolean;
}

const EntitiesTab: React.FC<EntitiesTabProps> = ({ entities, containsTargetKeyword }) => {
  if (!entities || entities.length === 0) {
    return <EmptyEntitiesState />;
  }

  // Group entities by type for better visualization
  const entityTypes = getEntityTypes(entities);
  
  // Calculate some statistics for entities detection
  const totalEntityCount = entities.length;
  const entityTypeCount = entityTypes.length;
  const multiWordEntitiesCount = getMultiWordEntitiesCount(entities);

  return (
    <div className="space-y-4">
      <EntityAlerts 
        entities={entities} 
        entityTypeCount={entityTypeCount} 
        totalEntityCount={totalEntityCount} 
      />

      <EntityStatsDisplay 
        entityTypes={entityTypes}
        entities={entities}
        totalEntityCount={totalEntityCount}
        entityTypeCount={entityTypeCount}
        multiWordEntitiesCount={multiWordEntitiesCount}
      />
      
      <EntityTable 
        entities={entities}
        containsTargetKeyword={containsTargetKeyword}
        countWords={countWords}
      />
    </div>
  );
};

export default EntitiesTab;
