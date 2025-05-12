
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
  
  return `You are an SEO and content optimization expert. Your task is to improve the following text to optimize for these target keywords: ${keywordsString}.

Original text:
${originalText}

Maintain the original meaning and tone of the text, but improve it to:
1. Include target keywords in strategic positions (beginning, headings, and first paragraphs)
2. Slightly increase the density of target keywords in the text
3. Use synonyms and semantic variations of the target keywords
4. Keep the text natural and readable

Provide only the optimized text, without any additional explanations.`;
};

/**
 * Ottimizza il testo utilizzando un'API AI
 */
export const optimizeTextWithAI = async (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any,
  apiKey: string,
  model: string = "gpt-4o-mini"
): Promise<string> => {
  try {
    const prompt = generateOptimizationPrompt(originalText, targetKeywords, analysisResults);
    
    // OpenAI implementation
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an assistant specialized in SEO and keyword optimization."
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
      throw new Error(error.error?.message || "Error in optimization API");
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in text optimization:", error);
    throw error;
  }
};
