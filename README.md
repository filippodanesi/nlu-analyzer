# IBM Watson Natural Language Understanding Analyzer

Powerful tool for analyzing text content using IBM Watson's Natural Language Understanding (NLU) service. This application provides an elegant way to extract insights from text data through advanced NLU techniques.

## Features

- **Text Analysis** - Analyze text content using IBM Watson NLU capabilities
- **Multiple Analysis Features** - Extract keywords, entities, concepts, relations, and categories
- **Target Keyword Highlighting** - Specify target keywords to highlight in results
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

## API Configuration

### Authentication Options

The application provides several options for authenticating with IBM Watson's NLU API:

1. **Environment Variables** - Use credentials from environment variables or `ibm-credentials.env` file
2. **Direct API Key** - Enter your API key directly in the configuration panel
3. **Region Selection** - Choose from predefined IBM Cloud regions or specify a custom URL
4. **Instance ID** - Specify your service instance ID for the selected region

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

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd watson-nlu-explorer
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
```

**Important**: This file is automatically ignored by git. Never commit it to the repository!

#### Method 2: Using .env file

Create a `.env` file in the project root:

```env
VITE_NATURAL_LANGUAGE_UNDERSTANDING_APIKEY=your-api-key-here
VITE_NATURAL_LANGUAGE_UNDERSTANDING_URL=your-service-url-here
VITE_NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE=iam
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser to `http://localhost:8080`

### Required API Credentials

To use this application, you'll need:

1. An IBM Cloud account
2. An active Watson Natural Language Understanding service instance
3. API key and URL from your service credentials

## Production Deployment

### Vercel Deployment

1. Deploy the repository to Vercel
2. Add the following environment variables in your Vercel project settings:
   - `NATURAL_LANGUAGE_UNDERSTANDING_APIKEY`
   - `NATURAL_LANGUAGE_UNDERSTANDING_URL`
   - `NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE`

The application automatically detects and uses these environment variables in production.

## Usage Guide

1. Configure the API credentials (automatic if using environment variables)
2. Enter text directly or upload a text file
3. (Optional) Add target keywords for highlighting
4. Click "Analyze" to process your content
5. View results in organized tabs based on feature categories

## Security Best Practices

- **Never commit credentials**: The `ibm-credentials.env` and `.env` files are gitignored
- **Use environment variables**: Store credentials in your hosting platform's environment variables
- **Rotate API keys**: Regularly update your IBM Watson API keys
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

### State Management

The application uses React's useState hook to manage:

- API configuration state
- Feature selection state
- Input and analysis state
- Results display state

### API Integration

Text analysis is performed by sending requests to the IBM Watson NLU API with:

- Content to analyze (text or HTML)
- Selected features to extract
- Feature-specific parameters and limits
- Language specification

## Troubleshooting

### Environment Variables Not Loading

If the application doesn't detect your environment variables:

1. Ensure the file names are correct (`ibm-credentials.env` or `.env`)
2. Restart the development server after creating/modifying env files
3. Check that variables are properly formatted
4. For Vercel deployments, ensure variables are added to the project settings

### API Authentication Errors

1. Verify your API key is correct
2. Check that the URL matches your IBM Watson instance
3. Ensure your Watson NLU service is active
4. Confirm the auth type is set correctly (usually `iam`)

## Contributors

- Built with React, Typescript, and Tailwind CSS
- UI inspired by Vercel's minimalist design principles
- NLP functionality powered by IBM Watson's NLU service

## License

This project is licensed under the MIT License - see the LICENSE file for details.
