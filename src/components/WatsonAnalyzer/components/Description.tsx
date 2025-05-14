
import React from 'react';

const Description: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-4 border-b border-border">
      <p className="text-sm text-muted-foreground">
        This analyzer uses IBM Watson's natural language understanding tool for extracting meaningful information from text, 
        including keywords, entities, concepts, categories, and relationships. It provides insights into emotional tone, sentiment, 
        and content structure. Ideal for content analysis and SEO optimization. The tool also supports AI-powered optimization 
        using OpenAI's GPT models and Anthropic's Claude to enhance your text for targeted keywords.
      </p>
    </div>
  );
};

export default Description;
