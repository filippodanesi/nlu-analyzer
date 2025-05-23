
import { useState, useEffect } from 'react';

export interface ModelCostData {
  name: string;
  inputCostPer1M: number;  // costo per 1 milione di token in input
  outputCostPer1M: number; // costo per 1 milione di token in output
  tokensPerCharInput: number;  // approssimazione di token per carattere in input
  tokensPerCharOutput: number; // approssimazione di token per carattere in output
}

export interface CostRecord {
  timestamp: number;
  model: string;
  inputChars: number;
  outputChars: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCost: number;
}

// Costi aggiornati per modello (prezzi per 1M token al 23/05/2024)
const MODEL_COSTS: Record<string, ModelCostData> = {
  'gpt-4o-mini': {
    name: 'GPT-4o-mini',
    inputCostPer1M: 1.00,
    outputCostPer1M: 3.00,
    tokensPerCharInput: 0.25,
    tokensPerCharOutput: 0.25
  },
  'gpt-4o': {
    name: 'GPT-4o',
    inputCostPer1M: 5.00,
    outputCostPer1M: 15.00,
    tokensPerCharInput: 0.25,
    tokensPerCharOutput: 0.25
  },
  'o4-mini-2025-04-16': {
    name: 'o4-mini',
    inputCostPer1M: 1.10,
    outputCostPer1M: 4.40,
    tokensPerCharInput: 0.25, 
    tokensPerCharOutput: 0.25
  },
  // Claude Sonnet 4
  'claude-sonnet-4-20250514': {
    name: 'Claude 4 Sonnet',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    tokensPerCharInput: 0.25,
    tokensPerCharOutput: 0.25
  },
  // Claude 3.7 Sonnet (legacy model)
  'claude-3-7-sonnet-20250219': {
    name: 'Claude 3.7 Sonnet',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    tokensPerCharInput: 0.25,
    tokensPerCharOutput: 0.25
  },
  // Claude 3 Haiku
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25, 
    tokensPerCharInput: 0.25,
    tokensPerCharOutput: 0.25
  },
  // Claude Haiku 3.5
  'claude-haiku-3-5': {
    name: 'Claude Haiku 3.5',
    inputCostPer1M: 0.80,
    outputCostPer1M: 4.00,
    tokensPerCharInput: 0.25,
    tokensPerCharOutput: 0.25
  },
  // Claude Opus 4
  'claude-opus-4': {
    name: 'Claude Opus 4',
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    tokensPerCharInput: 0.25,
    tokensPerCharOutput: 0.25
  },
  // Claude Opus 3 (legacy model)
  'claude-opus-3': {
    name: 'Claude Opus 3',
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    tokensPerCharInput: 0.25,
    tokensPerCharOutput: 0.25
  }
};

// Budget iniziale per provider
const DEFAULT_BUDGETS = {
  openai: 5.00,  // $5 per OpenAI
  anthropic: 5.00 // $5 per Claude
};

export const useCostTracker = () => {
  // Storico dei costi
  const [costHistory, setCostHistory] = useState<CostRecord[]>(() => {
    const saved = localStorage.getItem('ai_cost_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Budget rimasto per provider
  const [remainingBudget, setRemainingBudget] = useState(() => {
    const saved = localStorage.getItem('ai_remaining_budget');
    return saved ? JSON.parse(saved) : { ...DEFAULT_BUDGETS };
  });

  // Costo totale per provider
  const [totalCost, setTotalCost] = useState(() => {
    const saved = localStorage.getItem('ai_total_cost');
    return saved ? JSON.parse(saved) : { openai: 0, anthropic: 0 };
  });

  // Salva i dati quando cambiano
  useEffect(() => {
    localStorage.setItem('ai_cost_history', JSON.stringify(costHistory));
    localStorage.setItem('ai_remaining_budget', JSON.stringify(remainingBudget));
    localStorage.setItem('ai_total_cost', JSON.stringify(totalCost));
  }, [costHistory, remainingBudget, totalCost]);

  // Resetta i dati di tracciamento
  const resetTracking = (provider?: 'openai' | 'anthropic') => {
    if (provider) {
      // Resetta solo per un provider specifico
      setCostHistory(prev => prev.filter(record => {
        const isOpenAI = ['gpt-4o-mini', 'gpt-4o', 'o4-mini-2025-04-16'].includes(record.model);
        return provider === 'openai' ? !isOpenAI : isOpenAI;
      }));
      setRemainingBudget(prev => ({
        ...prev,
        [provider]: DEFAULT_BUDGETS[provider]
      }));
      setTotalCost(prev => ({
        ...prev,
        [provider]: 0
      }));
    } else {
      // Resetta tutto
      setCostHistory([]);
      setRemainingBudget({ ...DEFAULT_BUDGETS });
      setTotalCost({ openai: 0, anthropic: 0 });
    }
  };

  // Reimposta il budget
  const setBudget = (provider: 'openai' | 'anthropic', amount: number) => {
    setRemainingBudget(prev => ({
      ...prev,
      [provider]: amount
    }));
  };

  // Calcola e registra il costo di un'operazione
  const trackOperation = (model: string, inputText: string, outputText: string): CostRecord | null => {
    const modelData = MODEL_COSTS[model];
    if (!modelData) {
      console.warn(`Model cost data not available for ${model}`);
      return null;
    }

    // Calcola lunghezze in caratteri
    const inputChars = inputText.length;
    const outputChars = outputText.length;

    // Stima token in base ai caratteri (approssimazione)
    const estimatedInputTokens = Math.ceil(inputChars * modelData.tokensPerCharInput);
    const estimatedOutputTokens = Math.ceil(outputChars * modelData.tokensPerCharOutput);

    // Calcola costo stimato
    const inputCost = (estimatedInputTokens / 1000000) * modelData.inputCostPer1M;
    const outputCost = (estimatedOutputTokens / 1000000) * modelData.outputCostPer1M;
    const estimatedCost = inputCost + outputCost;

    // Determina il provider in base al modello
    const provider = model.startsWith('claude') ? 'anthropic' : 'openai';

    // Registra il costo
    const costRecord: CostRecord = {
      timestamp: Date.now(),
      model,
      inputChars,
      outputChars,
      estimatedInputTokens,
      estimatedOutputTokens,
      estimatedCost
    };

    setCostHistory(prev => [...prev, costRecord]);

    // Aggiorna il budget rimanente
    setRemainingBudget(prev => ({
      ...prev,
      [provider]: Math.max(0, prev[provider] - estimatedCost)
    }));

    // Aggiorna il costo totale
    setTotalCost(prev => ({
      ...prev,
      [provider]: prev[provider] + estimatedCost
    }));

    return costRecord;
  };

  // Ottieni i dati di costo per un modello
  const getModelCostData = (model: string): ModelCostData | undefined => {
    return MODEL_COSTS[model];
  };

  return {
    costHistory,
    remainingBudget,
    totalCost,
    trackOperation,
    resetTracking,
    setBudget,
    getModelCostData
  };
};
