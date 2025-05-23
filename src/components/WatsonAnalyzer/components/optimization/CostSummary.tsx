
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, DollarSign, ReceiptText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { AIProvider } from '../../hooks/useTextOptimization';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  
  // Find the latest model used (for display purposes)
  const latestModel = lastCostRecord?.model ? costTracker.getModelCostData(lastCostRecord.model)?.name : null;

  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium flex items-center">
          <ReceiptText className="h-4 w-4 mr-1" />
          API Usage Costs
        </h3>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-muted-foreground flex items-center mt-1 cursor-help">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Last operation: ${(lastCostRecord.estimatedCost).toFixed(5)}
                    {latestModel && <span className="ml-1">({latestModel})</span>}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p>Input: {lastCostRecord.estimatedInputTokens} tokens</p>
                    <p>Output: {lastCostRecord.estimatedOutputTokens} tokens</p>
                    <p className="font-semibold mt-1">Model pricing:</p>
                    {lastCostRecord.model && costTracker.getModelCostData(lastCostRecord.model) && (
                      <>
                        <p>Input: ${costTracker.getModelCostData(lastCostRecord.model).inputCostPer1M.toFixed(2)}/MTok</p>
                        <p>Output: ${costTracker.getModelCostData(lastCostRecord.model).outputCostPer1M.toFixed(2)}/MTok</p>
                      </>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummary;
