import { z } from 'zod';
import type { AgentTool, ToolContext } from '../../core/agents/types';

const WeatherParams = z.object({
  location: z.string().describe('The city or location to get weather for'),
  units: z.enum(['celsius', 'fahrenheit']).optional()
    .describe('Temperature units (defaults to celsius)')
});

type WeatherParams = z.infer<typeof WeatherParams>;

interface WeatherResponse {
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
}

export const getWeatherTool: AgentTool<WeatherParams, WeatherResponse> = {
  name: 'getWeather',
  description: 'Get the current weather for a location',
  parameters: WeatherParams,
  
  async execute(args: WeatherParams, context: ToolContext): Promise<WeatherResponse> {
    const { location, units = 'celsius' } = args;
    const { logging } = context;
    
    logging?.logger?.debug('Getting weather', { location, units });

    try {
      // Example: Call a weather API
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Convert API response to our format
      const weather: WeatherResponse = {
        temperature: units === 'celsius' ? data.current.temp_c : data.current.temp_f,
        conditions: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph
      };

      logging?.logger?.info('Weather fetched successfully', { location, weather });
      
      // Log to Langfuse if available
      logging?.trace?.observation({
        name: 'weather-api-call',
        value: location,
        metadata: weather
      });

      return weather;
    } catch (error) {
      logging?.logger?.error('Weather API error', { error, location });
      throw new Error(`Failed to get weather for ${location}: ${error.message}`);
    }
  }
}; 