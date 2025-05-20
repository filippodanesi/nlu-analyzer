
/**
 * Utility functions for Google Cloud Natural Language API integration
 */

// Function to analyze text using Google NLP API
export const analyzeTextWithGoogleNLP = async (
  text: string,
  apiKey: string,
  features: {
    entities: boolean;
    sentiment: boolean;
    syntax: boolean;
    classification: boolean;
  },
  model: string = 'default'
) => {
  try {
    // Prepare request body
    const requestBody: any = {
      document: {
        type: "PLAIN_TEXT",
        content: text
      },
      features: {
        extractEntities: features.entities,
        extractDocumentSentiment: features.sentiment,
        extractSyntax: features.syntax,
        classifyText: features.classification,
      },
      encodingType: "UTF8"
    };

    // Apply model-specific configurations
    if (model === "content-classification") {
      // Enhance classification settings for content-classification model
      requestBody.features.classifyText = true;
    } else if (model === "entity-sentiment") {
      // Force entity sentiment analysis on for entity-sentiment model
      requestBody.features.extractEntitySentiment = true;
    }

    // Select the appropriate API endpoint based on the features
    let apiEndpoint = 'annotateText'; // default endpoint

    // For pure entity sentiment analysis
    if (features.entities && !features.sentiment && !features.syntax && !features.classification && model === "entity-sentiment") {
      apiEndpoint = 'analyzeEntitySentiment';
      // Adjust request body for specific endpoint
      delete requestBody.features;
    } 
    // For pure classification
    else if (!features.entities && !features.sentiment && !features.syntax && features.classification) {
      apiEndpoint = 'classifyText';
      // Adjust request body for specific endpoint
      delete requestBody.features;
    }

    // Send request to Google NLP API
    const response = await fetch(
      `https://language.googleapis.com/v1/documents:${apiEndpoint}?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Google NLP API request failed');
    }

    const data = await response.json();
    
    // Transform the response to match Watson NLU format for seamless integration
    return transformGoogleNLPResponse(data, features);
  } catch (error) {
    console.error("Error analyzing text with Google NLP:", error);
    throw error;
  }
};

// Function to transform Google NLP response to match Watson NLU format
const transformGoogleNLPResponse = (
  googleResponse: any,
  features: {
    entities: boolean;
    sentiment: boolean;
    syntax: boolean;
    classification: boolean;
  }
) => {
  const result: any = {
    language: googleResponse.language || "en"
  };

  // Transform entities
  if (features.entities && googleResponse.entities) {
    result.entities = googleResponse.entities.map((entity: any) => ({
      type: entity.type,
      text: entity.name,
      relevance: entity.salience,
      confidence: 1.0, // Google doesn't provide confidence score
      count: entity.mentions?.length || 1,
      sentiment: entity.sentiment ? {
        score: entity.sentiment.score,
        label: entity.sentiment.score > 0 ? "positive" : entity.sentiment.score < 0 ? "negative" : "neutral"
      } : undefined
    }));
  }

  // Transform sentiment
  if (features.sentiment && googleResponse.documentSentiment) {
    result.sentiment = {
      document: {
        score: googleResponse.documentSentiment.score,
        label: googleResponse.documentSentiment.score > 0 ? "positive" : 
               googleResponse.documentSentiment.score < 0 ? "negative" : "neutral"
      }
    };
  }

  // Transform categories for classification
  if (features.classification && googleResponse.categories) {
    result.categories = googleResponse.categories.map((category: any) => ({
      label: category.name.replace(/^\//, '').replace(/\//g, ' > '),
      score: category.confidence
    }));
  }

  // Add keywords based on entity salience
  if (features.entities && googleResponse.entities) {
    result.keywords = googleResponse.entities
      .filter((entity: any) => entity.salience > 0.1)
      .map((entity: any) => ({
        text: entity.name,
        relevance: entity.salience,
        sentiment: entity.sentiment ? {
          score: entity.sentiment.score,
          label: entity.sentiment.score > 0 ? "positive" : entity.sentiment.score < 0 ? "negative" : "neutral"
        } : undefined
      }));
  }

  return result;
};

// Function to map Watson feature names to Google NLP feature names
export const mapWatsonToGoogleFeatures = (watsonFeatures: any) => {
  return {
    entities: watsonFeatures.entities,
    sentiment: true, // Always include sentiment for entities
    syntax: false, // Not used in current UI
    classification: watsonFeatures.categories
  };
};
