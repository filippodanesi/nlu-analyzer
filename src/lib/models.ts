export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic';
  description: string;
  costEffective: boolean;
}

export const models: ModelConfig[] = [
  {
    id: 'o4-mini',
    name: 'o4-mini',
    provider: 'openai',
    description: 'Cost-effective OpenAI model for general purpose tasks',
    costEffective: true,
  },
  {
    id: 'o3',
    name: 'o3',
    provider: 'openai',
    description: 'High-performance OpenAI model with advanced capabilities',
    costEffective: false,
  },
  {
    id: 'claude-sonnet-4-0',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    description: 'Cost-effective Anthropic model with good performance',
    costEffective: true,
  },
  {
    id: 'claude-opus-4-0',
    name: 'Claude Opus 4',
    provider: 'anthropic',
    description: 'High-performance Anthropic model with superior capabilities',
    costEffective: false,
  },
];

export const getModelById = (id: string): ModelConfig | undefined => {
  return models.find(model => model.id === id);
};

export const getModelsByProvider = (provider: 'openai' | 'anthropic'): ModelConfig[] => {
  return models.filter(model => model.provider === provider);
};

export const getCostEffectiveModels = (): ModelConfig[] => {
  return models.filter(model => model.costEffective);
};

export const getHighPerformanceModels = (): ModelConfig[] => {
  return models.filter(model => !model.costEffective);
}; 