
// Funzioni di utilità per l'ottimizzazione del testo basata su AI

/**
 * Controlla se una parola chiave target è nelle posizioni principali
 */
export const isKeywordInTopPositions = (
  targetKeyword: string,
  keywords: any[],
  topN: number = 3
): boolean => {
  if (!keywords || keywords.length === 0 || !targetKeyword) return false;
  
  // Verifica se la keyword è tra le prime N posizioni
  const topKeywords = keywords.slice(0, topN);
  return topKeywords.some(kw => 
    kw.text.toLowerCase().includes(targetKeyword.toLowerCase())
  );
};

/**
 * Genera il prompt per l'ottimizzazione del testo
 */
export const generateOptimizationPrompt = (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any
): string => {
  const keywordsString = targetKeywords.join(', ');
  
  return `
Sei un esperto di SEO e content optimization. Il tuo compito è migliorare il seguente testo in modo che ottimizzi per le seguenti parole chiave target: ${keywordsString}.

Testo originale:
"""
${originalText}
"""

Mantieni il senso e il tono originale del testo, ma miglioralo per:
1. Includere le parole chiave target in posizioni strategiche (inizio, titoli, e primi paragrafi)
2. Aumentare leggermente la densità delle parole chiave target nel testo
3. Usare sinonimi e variazioni semantiche delle parole chiave target
4. Mantenere il testo naturale e leggibile

Fornisci solo il testo ottimizzato, senza spiegazioni aggiuntive.
`;
};

/**
 * Ottimizza il testo utilizzando un'API AI
 */
export const optimizeTextWithAI = async (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any,
  apiKey: string
): Promise<string> => {
  try {
    const prompt = generateOptimizationPrompt(originalText, targetKeywords, analysisResults);
    
    // Implementazione con OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Sei un assistente specializzato nell'ottimizzazione di testi per SEO e parole chiave."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Errore nell'API di ottimizzazione");
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Errore nell'ottimizzazione del testo:", error);
    throw error;
  }
};
