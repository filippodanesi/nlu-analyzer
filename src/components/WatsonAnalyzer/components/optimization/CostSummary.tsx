
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { AIProvider } from '../../hooks/useTextOptimization';

interface CostSummaryProps {
  costTracker: any;
  activeProvider: AIProvider;
  lastCostRecord: any;
}

/**
 * Displays cost summary and budget information
 */
const CostSummary: React.FC<CostSummaryProps> = ({ costTracker, activeProvider, lastCostRecord }) => {
  // Format number to always show 2 decimal places
  const formatCurrency = (value: number): string => {
    return (Math.round(value * 100) / 100).toFixed(2);
  };
  
  if (!costTracker) return null;
  
  const remainingBudget = costTracker.remainingBudget[activeProvider];
  const totalBudget = 5.00; // Default budget value
  const usedBudget = totalBudget - remainingBudget;
  const percentUsed = Math.min(100, (usedBudget / totalBudget) * 100);
  
  // Calculate the total cost across all operations
  const totalCost = costTracker.totalCost[activeProvider];
  
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4 pb-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Budget Usage
            </span>
            <span className="text-sm font-mono">
              ${formatCurrency(usedBudget)} / ${formatCurrency(totalBudget)}
            </span>
          </div>
          
          <Progress value={percentUsed} className="h-2" />
          
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Remaining: ${formatCurrency(remainingBudget)}</span>
            <span>Total cost: ${formatCurrency(totalCost)}</span>
          </div>
          
          {lastCostRecord && (
            <div className="text-xs text-muted-foreground flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              Last operation: ${(lastCostRecord.estimatedCost).toFixed(5)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummary;
