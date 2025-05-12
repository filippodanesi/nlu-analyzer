// Type definitions for export data
export interface ExportData {
  metadata: {
    language: string;
    timestamp: string;
    version: string;
  };
  statistics: Record<string, any>;
  analysis: {
    keywords?: Array<{
      text: string;
      relevance: number;
      sentiment?: {
        score: number;
        label: string;
      } | null;
    }>;
    entities?: Array<{
      text: string;
      type: string;
      relevance: number;
      confidence: number;
      sentiment?: {
        score: number;
        label: string;
      } | null;
    }>;
    concepts?: Array<{
      text: string;
      relevance: number;
      dbpedia_resource: string;
    }>;
    categories?: Array<{
      label: string;
      score: number;
      explanation: string;
    }>;
    classifications?: Array<{
      class_name: string;
      confidence: number;
    }>;
  };
}

// Prepare data for export in JSON format
export const prepareExportData = (results: any): string => {
  if (!results) return "";

  const exportData: ExportData = {
    metadata: {
      language: results.language || "unknown",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    },
    statistics: {},
    analysis: {}
  };

  // Extract keywords data if available
  if (results.keywords && results.keywords.length > 0) {
    exportData.analysis.keywords = results.keywords.map((keyword: any) => ({
      text: keyword.text,
      relevance: keyword.relevance,
      sentiment: keyword.sentiment ? {
        score: keyword.sentiment.score,
        label: keyword.sentiment.label
      } : null
    }));
  }

  // Extract entities data if available
  if (results.entities && results.entities.length > 0) {
    exportData.analysis.entities = results.entities.map((entity: any) => ({
      text: entity.text,
      type: entity.type,
      relevance: entity.relevance,
      confidence: entity.confidence,
      sentiment: entity.sentiment ? {
        score: entity.sentiment.score,
        label: entity.sentiment.label
      } : null
    }));
  }

  // Extract concepts data if available
  if (results.concepts && results.concepts.length > 0) {
    exportData.analysis.concepts = results.concepts.map((concept: any) => ({
      text: concept.text,
      relevance: concept.relevance,
      dbpedia_resource: concept.dbpedia_resource
    }));
  }

  // Extract categories data if available
  if (results.categories && results.categories.length > 0) {
    exportData.analysis.categories = results.categories.map((category: any) => ({
      label: category.label,
      score: category.score,
      explanation: category.explanation
    }));
  }

  // Extract classifications/tone data if available
  if (results.classifications && results.classifications.length > 0) {
    exportData.analysis.classifications = results.classifications.map((classification: any) => ({
      class_name: classification.class_name,
      confidence: classification.confidence
    }));
  }

  return JSON.stringify(exportData, null, 2);
};

// Generate CSV content from results with better organization
export const generateCsvContent = (results: any): string => {
  if (!results) return "";
  
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add metadata section header
  csvContent += "## METADATA ##\n";
  csvContent += "Language," + (results.language || "unknown") + "\n";
  csvContent += "Timestamp," + new Date().toISOString() + "\n";
  csvContent += "Version,1.0.0\n\n";
  
  // Add keyword section if available
  if (results.keywords && results.keywords.length > 0) {
    csvContent += "## KEYWORDS ##\n";
    csvContent += "Text,Relevance,Sentiment Score,Sentiment Label\n";
    
    results.keywords.forEach((keyword: any) => {
      const sentimentScore = keyword.sentiment ? keyword.sentiment.score : "";
      const sentimentLabel = keyword.sentiment ? keyword.sentiment.label : "";
      const row = [
        `"${keyword.text.replace(/"/g, '""')}"`, 
        keyword.relevance,
        sentimentScore,
        sentimentLabel
      ];
      csvContent += row.join(",") + "\n";
    });
    csvContent += "\n";
  }

  // Add entity section if available
  if (results.entities && results.entities.length > 0) {
    csvContent += "## ENTITIES ##\n";
    csvContent += "Text,Type,Relevance,Confidence,Sentiment Score,Sentiment Label\n";
    
    results.entities.forEach((entity: any) => {
      const sentimentScore = entity.sentiment ? entity.sentiment.score : "";
      const sentimentLabel = entity.sentiment ? entity.sentiment.label : "";
      const row = [
        `"${entity.text.replace(/"/g, '""')}"`,
        entity.type,
        entity.relevance,
        entity.confidence,
        sentimentScore,
        sentimentLabel
      ];
      csvContent += row.join(",") + "\n";
    });
    csvContent += "\n";
  }

  // Add concepts section if available
  if (results.concepts && results.concepts.length > 0) {
    csvContent += "## CONCEPTS ##\n";
    csvContent += "Text,Relevance,DBpedia Resource\n";
    
    results.concepts.forEach((concept: any) => {
      const row = [
        `"${concept.text.replace(/"/g, '""')}"`,
        concept.relevance,
        `"${concept.dbpedia_resource}"`
      ];
      csvContent += row.join(",") + "\n";
    });
    csvContent += "\n";
  }

  // Add categories section if available
  if (results.categories && results.categories.length > 0) {
    csvContent += "## CATEGORIES ##\n";
    csvContent += "Label,Score,Explanation\n";
    
    results.categories.forEach((category: any) => {
      const row = [
        `"${category.label.replace(/"/g, '""')}"`,
        category.score,
        `"${category.explanation?.replace(/"/g, '""') || ""}"`
      ];
      csvContent += row.join(",") + "\n";
    });
    csvContent += "\n";
  }

  // Add classifications/tone section if available
  if (results.classifications && results.classifications.length > 0) {
    csvContent += "## TONE ANALYSIS ##\n";
    csvContent += "Class Name,Confidence\n";
    
    results.classifications.forEach((classification: any) => {
      const row = [
        `"${classification.class_name.replace(/"/g, '""')}"`,
        classification.confidence
      ];
      csvContent += row.join(",") + "\n";
    });
  }

  return csvContent;
};

// Download utilities
export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const encodedUri = encodeURI(content);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getCurrentDateString = (): string => {
  return new Date().toISOString().slice(0, 10);
};
