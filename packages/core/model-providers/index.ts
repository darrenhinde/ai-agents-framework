import { openai } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { ollama, createOllama } from "ollama-ai-provider";
import type { ModelProvider, ModelConfig } from './model-configs';
import { modelConfigs } from './model-configs';

export function getOperationalModels(): ModelConfig[] {
  return modelConfigs.filter(config => {
    switch (config.provider) {
      case 'openai':
        return !!process.env.OPENAI_API_KEY;
      case 'ollama':
        return !!process.env.OLLAMA_BASE_URL && !!process.env.OLLAMA_MODEL;
      case 'google':
        return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      case 'anthropic':
        return !!process.env.ANTHROPIC_API_KEY;
      default:
        return false;
    }
  });
}

export function getModel(specifiedModel?: string) {
  const operationalModels = getOperationalModels();

  if (operationalModels.length === 0) {
    throw new Error("No operational AI models found. Please check your environment variables.");
  }

  let selectedConfig: ModelConfig;
  let selectedModel: string;

  if (specifiedModel) {
    // Split model string in case it's in format "provider:model"
    const [providerName, modelName] = specifiedModel.split(':');
    
    // Find config for the specified provider
    const foundConfig = operationalModels.find(config => 
      config.provider === providerName || config.models.includes(specifiedModel)
    );
    
    if (!foundConfig) {
      throw new Error(`Provider ${providerName} not found or not operational`);
    }

    selectedConfig = foundConfig;
    
    // If a specific model was provided after the colon, use it
    // Otherwise use the first model for that provider
    selectedModel = modelName || selectedConfig.models[0];
    
    // If just provider name was given (e.g. 'openai'), use first model
    if (!modelName && providerName === selectedConfig.provider) {
      selectedModel = selectedConfig.models[0];
    }
  } else {
    // Default to Google's gemini-1.5-flash-latest if available, otherwise use the first operational model
    selectedConfig = operationalModels.find(config => 
      config.provider === 'google' && config.models.includes('gemini-1.5-flash-latest')
    ) || operationalModels[0];
    selectedModel = selectedConfig.provider === 'google' ? 'gemini-1.5-flash-latest' : selectedConfig.models[0];
  }

  switch (selectedConfig.provider) {
    case 'openai':
      return openai(selectedModel);
    case 'ollama': {
      const ollam_model = selectedModel || process.env.OLLAMA_MODEL || 'llama3.2';
      console.log("Using Ollama model", ollam_model);
      const ollamaClient = createOllama({
        baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/api',
      });
      return ollamaClient(ollam_model);
    }
    case 'google': {
      const googleAI = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
      });
      return googleAI(selectedModel);
    }
    case 'anthropic':
      return anthropic(selectedModel);
    default:
      throw new Error(`Unsupported model provider: ${selectedConfig.provider}`);
  }
}