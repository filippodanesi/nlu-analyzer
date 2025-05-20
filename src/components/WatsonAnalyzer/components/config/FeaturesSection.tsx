
import React from 'react';
import { 
  Switch 
} from "@/components/ui/switch";
import { 
  Label 
} from "@/components/ui/label";

interface FeaturesSectionProps {
  features: {
    keywords: boolean;
    entities: boolean;
    concepts: boolean;
    categories: boolean;
    classifications: boolean;
  };
  setFeatures: (features: any) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
  setFeatures
}) => {
  const handleFeatureChange = (feature: string, value: boolean) => {
    setFeatures({
      ...features,
      [feature]: value
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Funzionalità di Analisi</h3>
      
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Estrazione</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="keywords"
              checked={features.keywords}
              onCheckedChange={(checked) => handleFeatureChange("keywords", checked)}
            />
            <Label htmlFor="keywords">Keywords</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="entities"
              checked={features.entities}
              onCheckedChange={(checked) => handleFeatureChange("entities", checked)}
            />
            <Label htmlFor="entities">Entità</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="concepts"
              checked={features.concepts}
              onCheckedChange={(checked) => handleFeatureChange("concepts", checked)}
            />
            <Label htmlFor="concepts">Concetti</Label>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Classificazione</h4>
        <div className="flex items-center space-x-2">
          <Switch
            id="categories"
            checked={features.categories}
            onCheckedChange={(checked) => handleFeatureChange("categories", checked)}
          />
          <Label htmlFor="categories">Categorie</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Analisi del Tono</h4>
        <div className="flex items-center space-x-2">
          <Switch
            id="classifications"
            checked={features.classifications}
            onCheckedChange={(checked) => handleFeatureChange("classifications", checked)}
          />
          <Label htmlFor="classifications">Analisi del Tono</Label>
        </div>
      </div>
    </div>
  );
};
