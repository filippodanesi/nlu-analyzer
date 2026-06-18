
import React from 'react';
import { Progress } from "@/components/ui/progress";
import type { AIProvider } from '../../hooks/useTextOptimization';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CostSummaryProps {
  costTracker: any;
  activeProvider: AIProvider;
  lastCostRecord: any;
}

/**
 * Quiet, secondary read-out of API usage against the budget.
 */
const CostSummary: React.FC<CostSummaryProps> = ({ costTracker, activeProvider, lastCostRecord }) => {
  const formatCurrency = (value: number): string =>
    (Math.round(value * 100) / 100).toFixed(2);

  if (!costTracker) return null;

  const remainingBudget = costTracker.remainingBudget[activeProvider];
  const totalBudget = 5.00; // Default budget value
  const usedBudget = totalBudget - remainingBudget;
  const percentUsed = Math.min(100, (usedBudget / totalBudget) * 100);
  const totalCost = costTracker.totalCost[activeProvider];
  const latestModel = lastCostRecord?.model ? costTracker.getModelCostData(lastCostRecord.model)?.name : null;

  return (
    <div className="space-y-2 rounded-md border border-border/50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">API usage</span>
        <span className="text-xs font-mono text-muted-foreground">
          ${formatCurrency(usedBudget)} / ${formatCurrency(totalBudget)}
        </span>
      </div>

      <Progress value={percentUsed} className="h-1.5" />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Remaining ${formatCurrency(remainingBudget)}</span>
        {lastCostRecord ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help">
                  Last ${lastCostRecord.estimatedCost.toFixed(5)}
                  {latestModel && ` · ${latestModel}`}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p>Input: {lastCostRecord.estimatedInputTokens} tokens</p>
                  <p>Output: {lastCostRecord.estimatedOutputTokens} tokens</p>
                  {lastCostRecord.model && costTracker.getModelCostData(lastCostRecord.model) && (
                    <>
                      <p className="font-medium mt-1">Model pricing</p>
                      <p>In: ${costTracker.getModelCostData(lastCostRecord.model).inputCostPer1M.toFixed(2)}/MTok</p>
                      <p>Out: ${costTracker.getModelCostData(lastCostRecord.model).outputCostPer1M.toFixed(2)}/MTok</p>
                    </>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span>Total ${formatCurrency(totalCost)}</span>
        )}
      </div>
    </div>
  );
};

export default CostSummary;
