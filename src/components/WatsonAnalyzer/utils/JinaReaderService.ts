/**
 * Extracts clean, analysis-ready text from a URL via Jina Reader (r.jina.ai).
 *
 * Jina Reader works with no API key (rate-limited). An optional key raises the
 * limits. `X-Return-Format: text` returns plain prose — no markdown to strip —
 * which is ideal input for NLU analysis.
 */
interface ReaderSuccess {
  success: true;
  text: string;
}
interface ReaderError {
  success: false;
  error: string;
}
type ReaderResponse = ReaderSuccess | ReaderError;

export class JinaReaderService {
  private static API_KEY_STORAGE_KEY = 'jina_api_key';

  static saveApiKey(apiKey: string): void {
    sessionStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey.trim());
  }

  static getApiKey(): string | null {
    return sessionStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static clearApiKey(): void {
    sessionStorage.removeItem(this.API_KEY_STORAGE_KEY);
  }

  static async readUrl(url: string): Promise<ReaderResponse> {
    const apiKey = this.getApiKey();
    const headers: Record<string, string> = { 'X-Return-Format': 'text' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    try {
      const response = await fetch(`https://r.jina.ai/${url}`, { headers });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        const detail = body ? ` - ${body.slice(0, 200)}` : '';
        return { success: false, error: `Jina Reader error: ${response.status} ${response.statusText}${detail}` };
      }

      const text = (await response.text()).trim();
      if (!text) {
        return { success: false, error: 'Jina Reader returned empty content for this URL.' };
      }
      return { success: true, text };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reach Jina Reader',
      };
    }
  }
}
