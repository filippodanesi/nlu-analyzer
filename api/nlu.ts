import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Server-side proxy for IBM Watson Natural Language Understanding.
 *
 * The browser cannot call Watson directly (no CORS), so the SPA POSTs the
 * analysis request here and this function forwards it server-side.
 *
 * Credentials are hybrid: the caller's API key/URL are used when provided
 * (bring-your-own-key); otherwise the function falls back to server env vars
 * (NATURAL_LANGUAGE_UNDERSTANDING_APIKEY / _URL / _AUTH_TYPE), so the secret
 * key can live only on the server.
 */

const WATSON_HOST_SUFFIX = '.natural-language-understanding.watson.cloud.ibm.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { url, apiKey, authType, payload } = (req.body ?? {}) as {
      url?: string;
      apiKey?: string;
      authType?: string;
      payload?: unknown;
    };

    const watsonUrl = (url || process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL || '').trim();
    const key = (apiKey || process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY || '').trim();
    const auth = (authType || process.env.NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE || 'iam').trim();

    if (!key || !watsonUrl) {
      res.status(400).json({
        error:
          'Missing IBM Watson credentials. Enter an API key and instance in the UI, or set NATURAL_LANGUAGE_UNDERSTANDING_APIKEY / _URL on the server.',
      });
      return;
    }

    if (!payload || typeof payload !== 'object') {
      res.status(400).json({ error: 'Missing analysis payload.' });
      return;
    }

    // SSRF guard: only forward to IBM Watson NLU endpoints over HTTPS.
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(watsonUrl);
    } catch {
      res.status(400).json({ error: 'Invalid Watson URL.' });
      return;
    }
    if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname.endsWith(WATSON_HOST_SUFFIX)) {
      res.status(400).json({ error: 'URL is not an IBM Watson NLU endpoint.' });
      return;
    }

    const authorization =
      auth === 'bearer'
        ? `Bearer ${key}`
        : `Basic ${Buffer.from(`apikey:${key}`).toString('base64')}`;

    const watsonResponse = await fetch(watsonUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authorization },
      body: JSON.stringify(payload),
    });

    const data = await watsonResponse.json().catch(() => null);
    res.status(watsonResponse.status).json(data ?? { error: 'Empty response from IBM Watson.' });
  } catch (error) {
    res.status(502).json({
      error: error instanceof Error ? error.message : 'Proxy request to IBM Watson failed.',
    });
  }
}
