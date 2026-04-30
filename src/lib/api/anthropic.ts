import Anthropic from '@anthropic-ai/sdk';
import { ModelConfig } from '../models';

export class AnthropicService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async analyze(text: string, model: ModelConfig) {
    if (model.provider !== 'anthropic') {
      throw new Error('Invalid model provider');
    }

    try {
      const response = await this.client.messages.create({
        model: model.id,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: text,
          },
        ],
      });

      const block = response.content[0];
      if (!block || block.type !== 'text') {
        throw new Error('Anthropic returned no text content block');
      }
      return block.text;
    } catch (error) {
      console.error('Error analyzing text with Anthropic:', error);
      throw error;
    }
  }
}
