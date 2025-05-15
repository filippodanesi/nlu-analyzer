
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CostRecord } from '../../hooks/useCostTracker';
import { EuroIcon, Settings } from "lucide-react";

interface CostSummaryProps {
  costTracker: any;
  activeProvider: 'openai' | 'anthropic';
  lastCostRecord: CostRecord | null;
}

const CostSummary: React.FC<CostSummaryProps> = ({ costTracker, activeProvider, lastCostRecord }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [newBudget, setNewBudget] = useState('');

  const budget = costTracker.remainingBudget[activeProvider] || 0;
  const spent = costTracker.totalCost[activeProvider] || 0;
  const initialBudget = budget + spent;
  const percentUsed = initialBudget > 0 ? (spent / initialBudget) * 100 : 0;

  const resetTracking = () => {
    costTracker.resetTracking(activeProvider);
    setShowDetails(false);
  };

  const updateBudget = () => {
    const amount = parseFloat(newBudget);
    if (!isNaN(amount) && amount >= 0) {
      costTracker.setBudget(activeProvider, amount);
      setNewBudget('');
    }
  };

  // Format provider name for display
  const providerName = activeProvider === 'openai' ? 'OpenAI' : 'Anthropic';

  // Get last 10 operations for the current provider
  const recentOperations = costTracker.costHistory
    .filter((record: CostRecord) => {
      const isOpenAI = !record.model.startsWith('claude');
      return activeProvider === 'openai' ? isOpenAI : !isOpenAI;
    })
    .sort((a: CostRecord, b: CostRecord) => b.timestamp - a.timestamp)
    .slice(0, 10);

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-3">
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <EuroIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">
                {providerName} Budget: <span className="font-bold">${budget.toFixed(2)}</span>
              </span>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Budget Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-budget">Set {providerName} Budget ($)</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="new-budget"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter budget amount"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                      />
                      <Button onClick={updateBudget}>Update</Button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={resetTracking}
                    >
                      Reset {providerName} Tracking
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Spent: ${spent.toFixed(2)}</span>
              <span>Total: ${initialBudget.toFixed(2)}</span>
            </div>
            <Progress value={percentUsed} className="h-2" />
          </div>
          
          {lastCostRecord && (
            <div className="mt-2 text-xs text-muted-foreground">
              Last operation: <span className="font-semibold">${lastCostRecord.estimatedCost.toFixed(5)}</span> ({lastCostRecord.model})
            </div>
          )}
          
          <Button 
            variant="link" 
            className="p-0 h-auto text-xs mt-1"
            onClick={() => setShowDetails(true)}
          >
            View history
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{providerName} Cost History</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Input Tokens</TableHead>
                  <TableHead>Output Tokens</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOperations.length > 0 ? (
                  recentOperations.map((record: CostRecord, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(record.timestamp)}</TableCell>
                      <TableCell>{record.model}</TableCell>
                      <TableCell>{record.estimatedInputTokens.toLocaleString()}</TableCell>
                      <TableCell>{record.estimatedOutputTokens.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">${record.estimatedCost.toFixed(5)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No history available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CostSummary;
