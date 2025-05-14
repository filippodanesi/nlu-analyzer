
# Watson NLU & AI Text Optimizer

Powerful tool for analyzing and optimizing text content using IBM Watson's Natural Language Understanding (NLU) service combined with advanced AI models. This application provides an elegant way to extract insights from text data and improve content through AI-powered optimization.

## Features

- **Text Analysis** - Analyze text content using IBM Watson NLU capabilities
- **AI Text Optimization** - Optimize your content using OpenAI's GPT models and Anthropic's Claude
- **Multiple Analysis Features** - Extract keywords, entities, concepts, relations, and categories
- **Target Keyword Highlighting** - Specify target keywords to highlight in results
- **AI-Powered Suggestions** - Get AI-generated suggestions for improving your content
- **Modern UI** - Clean, Vercel-inspired interface with light and dark mode support
- **Text Stats** - View word count, sentence count, and character statistics
- **Multiple Input Methods** - Enter text directly or upload text files
- **Responsive Design** - Works on both desktop and mobile devices
- **Export Results** - Download your analysis results in JSON or CSV format

## Technical Architecture

The application is built using a modern React stack:

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn/ui component library
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks for local state management
- **Theming**: Light/dark mode with theme context provider
- **AI Integration**: APIs for OpenAI GPT models and Anthropic Claude

## API Configuration

### IBM Watson Authentication

The application provides multiple ways to authenticate with IBM Watson's NLU API:

1. **Direct Input** - Enter your API key, region, and instance ID directly in the configuration panel
2. **Quick Input** - Paste JSON credentials or URL for quick configuration
3. **Session Storage** - Credentials are saved to your browser's session storage for convenience

### AI Optimization Configuration

Configure AI optimization features with:

1. **AI Provider Selection** - Choose between OpenAI (GPT) or Anthropic (Claude)
2. **Model Selection** - Select the specific AI model to use for optimization
3. **API Key Management** - Securely enter your API keys in the configuration panel

### Available IBM Watson Regions

- Dallas (us-south)
- Washington DC (us-east)
- Frankfurt (eu-de)
- London (eu-gb)
- Sydney (au-syd)
- Tokyo (jp-tok)
- Seoul (kr-seo)
- Custom (user-specified URL)

## Feature Configuration

The application allows granular control of the NLU analysis features:

### Extraction Features

- **Keywords** - Extract significant keywords with relevance scores and sentiment
- **Entities** - Identify people, companies, locations, and other named entities
- **Concepts** - Identify conceptual associations, even if not explicitly mentioned
- **Relations** - Detect relationships between entities in text

### Classification Features

- **Categories** - Classify content into hierarchical taxonomy categories

### Advanced Parameters

Fine-tune analysis with configurable parameters:

- **Feature Limits** - Set maximum number of results for each feature
- **Language Selection** - Specify content language or use auto-detection

## Exporting Your Analysis

After analyzing your text content, you have multiple options to export and save your results:

### Export Formats

1. **JSON Export** - Download a complete structured JSON file containing all analysis data
   - Click the "Export JSON" button in the results panel
   - Includes all detected features (keywords, entities, concepts, etc.)
   - Perfect for programmatic use or further processing

2. **CSV Export** - Download results in CSV format for easy spreadsheet import
   - Click the "Export CSV" button in the results panel
   - Organized with clear section headers for each feature type
   - Compatible with Excel, Google Sheets, and other spreadsheet applications

### What's Included in Exports

Your exports will contain:

- **Metadata** - Language, timestamp, and version information
- **Analyzed Text** - The original text that was analyzed
- **Feature Results** - All detected features from your analysis:
  - Keywords with relevance and sentiment
  - Entities with type, relevance, and sentiment
  - Concepts with relevance and DBpedia resources
  - Categories with scores and explanations
  - Classifications/tone analysis (when available)

### Export File Naming

Exported files follow the naming convention:
- `nlu-analysis-YYYY-MM-DD.json` for JSON exports
- `nlu-analysis-YYYY-MM-DD.csv` for CSV exports

The date stamp ensures you can track when each analysis was performed.

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- IBM Watson Natural Language Understanding API credentials
- OpenAI API key (for GPT optimization)
- Anthropic API key (for Claude optimization)

### Usage

1. Access the application through your web browser
2. Configure the IBM Watson API credentials in the configuration panel
3. Enter text directly, upload a file, or scrape content from a URL
4. (Optional) Add target keywords for highlighting
5. Select the features you want to analyze
6. Click "Analyze" to process your content
7. View results in organized tabs based on feature categories
8. Use the AI Optimization tab to get suggestions for improving your content
9. Export your results using the JSON or CSV export buttons

### Required API Credentials

To use all features of this application, you'll need:

1. IBM Watson Natural Language Understanding service credentials
   - API key, region, and instance ID from your IBM Cloud account
2. An OpenAI account (for GPT optimization features)
   - API key from your OpenAI account
3. An Anthropic account (for Claude optimization features)
   - API key from your Anthropic account

## Security Best Practices

- **Session Storage Only** - Credentials are only stored in your browser's session storage
- **No Server Storage** - No credentials are stored on any server
- **Browser Session** - Credentials are cleared when you close your browser
- **Secure Input** - API key fields use password masking for security
- **Client-Side Processing** - All API requests are made directly from your browser

## URL Scraping

Extract content from websites using:

1. **Firecrawl Integration** - Clean content extraction from any URL
2. **Markdown Conversion** - Scraped content is converted to clean, analyzable text
3. **API Key Management** - Configure Firecrawl API key for web scraping

## Text Optimization

The application offers AI-powered text optimization using:

1. **OpenAI's GPT Models**
   - GPT-4o-mini and GPT-4o for efficient and powerful text generation
2. **Anthropic's Claude Models**
   - Claude 3.7 Sonnet for nuanced text optimization
3. **Optimization Features**
   - Keyword integration suggestions
   - Content improvements based on NLU analysis
   - SEO optimization recommendations

## Contributors

- Built with React, TypeScript, and Tailwind CSS
- UI inspired by Vercel's minimalist design principles
- NLP functionality powered by IBM Watson's NLU service
- Text optimization powered by OpenAI GPT models and Anthropic Claude

## License

This project is licensed under the MIT License - see the LICENSE file for details.
