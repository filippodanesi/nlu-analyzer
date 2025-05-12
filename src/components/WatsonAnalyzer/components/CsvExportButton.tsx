
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCsvContent, getCurrentDateString } from '../utils/exportUtils';

interface CsvExportButtonProps {
  results: any;
  isDisabled: boolean;
}

const CsvExportButton: React.FC<CsvExportButtonProps> = ({ results, isDisabled }) => {
  const { toast } = useToast();

  const handleExport = () => {
    if (!results || !results.keywords) {
      toast({
        title: "Esportazione fallita",
        description: "Nessun dato disponibile per l'esportazione CSV.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = generateCsvContent(results);
    const fileName = `watson-analysis-${getCurrentDateString()}.csv`;
    
    // Download the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Esportazione completata",
      description: "L'analisi è stata esportata in formato CSV.",
    });
  };

  return (
    <Button 
      onClick={handleExport}
      disabled={isDisabled}
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
    >
      <Download className="h-4 w-4" />
      Esporta CSV
    </Button>
  );
};

export default CsvExportButton;
