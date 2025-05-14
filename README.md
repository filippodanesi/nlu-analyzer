
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
3. **Import .env File** - Upload an IBM credentials file
4. **Session Storage** - Credentials are saved to your browser's session storage for convenience

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

## Usage Guide

1. Configure your IBM Watson API credentials:
   - Enter your API key
   - Select your IBM Cloud region
   - Enter your instance ID
2. Enter text directly, upload a file, or scrape a URL
3. (Optional) Add target keywords for highlighting
4. Click "Analyze" to process your content
5. View results in organized tabs based on feature categories
6. Use the AI Optimization tab to get suggestions for improving your content

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

## URL Scraping

Extract content from websites using:

1. **Firecrawl Integration** - Clean content extraction from any URL
2. **Markdown Conversion** - Scraped content is converted to clean, analyzable text
3. **API Key Management** - Configure Firecrawl API key for web scraping

## Technical Implementation Details

### Component Structure

- **ThemeProvider** - Context provider for light/dark mode theming
- **ApiConfigPanel** - Panel for configuring Watson NLU API settings
- **InputPanel** - Text input with file upload and target keyword options
- **ResultsPanel** - Organizes analysis results into feature-based tabs
- **TextOptimizationPanel** - Panel for AI-powered text optimization

### State Management

The application uses React's useState hook to manage:

- API configuration state
- Feature selection state
- Input and analysis state
- Results display state
- AI optimization state

### API Integration

Text analysis is performed by sending requests to:

- IBM Watson NLU API for text analysis features
- OpenAI API for GPT-powered text optimization
- Anthropic API for Claude-powered text optimization
- Firecrawl API for web content extraction

## Troubleshooting

### Session Storage Issues

If saved credentials are not loading:

1. Ensure you're using the same browser session
2. Check that you've saved credentials using the "Save to Session" button
3. Try clearing browser data and re-entering credentials

### API Authentication Errors

1. Verify your API keys are correct
2. Check that the region and instance ID match your service instances
3. Ensure your service instances are active
4. Confirm you have proper access to the APIs

## Contributors

- Built with React, TypeScript, and Tailwind CSS
- UI inspired by Vercel's minimalist design principles
- NLP functionality powered by IBM Watson's NLU service
- Text optimization powered by OpenAI GPT models and Anthropic Claude

## License

This project is licensed under the MIT License - see the LICENSE file for details.
