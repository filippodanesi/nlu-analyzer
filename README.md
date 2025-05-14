
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

### IBM Watson Authentication Options

The application provides several options for authenticating with IBM Watson's NLU API:

1. **Environment Variables** - Use credentials from environment variables or `ibm-credentials.env` file
2. **Direct API Key** - Enter your API key directly in the configuration panel
3. **Region Selection** - Choose from predefined IBM Cloud regions or specify a custom URL
4. **Instance ID** - Specify your service instance ID for the selected region

### AI Optimization Configuration

The application allows configuration of AI optimization features:

1. **AI Provider Selection** - Choose between OpenAI (GPT) or Anthropic (Claude)
2. **Model Selection** - Select the specific AI model to use for optimization
3. **Optimization Parameters** - Adjust the parameters for the optimization process, such as temperature

### Available Regions

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

- Node.js (v16+)
- npm or yarn package manager
- IBM Watson Natural Language Understanding API credentials
- OpenAI API key (for GPT optimization)
- Anthropic API key (for Claude optimization)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd watson-nlu-optimizer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure API credentials (choose one method):

#### Method 1: Using ibm-credentials.env (Recommended for local development)

Create a file named `ibm-credentials.env` in the project root:

```env
NATURAL_LANGUAGE_UNDERSTANDING_APIKEY=your-api-key-here
NATURAL_LANGUAGE_UNDERSTANDING_URL=your-service-url-here
NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE=iam
OPENAI_API_KEY=your-openai-api-key-here
```

**Important**: This file is automatically ignored by git. Never commit it to the repository!

#### Method 2: Using .env file

Create a `.env` file in the project root:

```env
VITE_NATURAL_LANGUAGE_UNDERSTANDING_APIKEY=your-api-key-here
VITE_NATURAL_LANGUAGE_UNDERSTANDING_URL=your-service-url-here
VITE_NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE=iam
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser to `http://localhost:8080`

### Required API Credentials

To use all features of this application, you'll need:

1. An IBM Cloud account with Watson Natural Language Understanding service
   - API key and URL from your service credentials
2. An OpenAI account (for GPT optimization features)
   - API key from your OpenAI account
3. An Anthropic account (for Claude optimization features)
   - API key from your Anthropic account

## Production Deployment

### Vercel Deployment

1. Deploy the repository to Vercel
2. Add the following environment variables in your Vercel project settings:
   - `NATURAL_LANGUAGE_UNDERSTANDING_APIKEY`
   - `NATURAL_LANGUAGE_UNDERSTANDING_URL`
   - `NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE`
   - `OPENAI_API_KEY`

The application automatically detects and uses these environment variables in production.

## Usage Guide

1. Configure the API credentials (automatic if using environment variables)
2. Enter text directly or upload a text file
3. (Optional) Add target keywords for highlighting
4. Click "Analyze" to process your content
5. View results in organized tabs based on feature categories
6. Use the AI Optimization tab to get suggestions for improving your content

## Security Best Practices

- **Never commit credentials**: The `ibm-credentials.env` and `.env` files are gitignored
- **Use environment variables**: Store credentials in your hosting platform's environment variables
- **Rotate API keys**: Regularly update your API keys
- **Limit access**: Restrict API key permissions to only what's needed

## Development

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running Tests

```bash
npm test
# or
yarn test
```

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

## Troubleshooting

### Environment Variables Not Loading

If the application doesn't detect your environment variables:

1. Ensure the file names are correct (`ibm-credentials.env` or `.env`)
2. Restart the development server after creating/modifying env files
3. Check that variables are properly formatted
4. For Vercel deployments, ensure variables are added to the project settings

### API Authentication Errors

1. Verify your API keys are correct
2. Check that the URLs match your service instances
3. Ensure your services are active
4. Confirm the auth types are set correctly

## Contributors

- Built with React, Typescript, and Tailwind CSS
- UI inspired by Vercel's minimalist design principles
- NLP functionality powered by IBM Watson's NLU service
- Text optimization powered by OpenAI GPT models and Anthropic Claude

## License

This project is licensed under the MIT License - see the LICENSE file for details.
