import { config } from 'dotenv';
import { Langfuse } from 'langfuse';
import { createRouterAgent } from './router';
import { formatResponse, setDebugOptions } from '../../core/agents/utils';

// Load environment variables
config();

// Enable debug logging
setDebugOptions({
  enabled: true,
  level: 'debug',
  logToolCalls: true,
  logTraces: true,
  logResponses: true
});

async function runContentTest() {
  try {
    // Initialize Langfuse
    const langfuse = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY || '',
      secretKey: process.env.LANGFUSE_SECRET_KEY || '',
      baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'
    });

    // Create router agent
    const router = createRouterAgent();

    // Test case 1: General query
    console.log('\n🔄 Testing general query...');
    const generalResult = await router.route(
      'What kind of content management tasks can you help me with?'
    );
    console.log('✅ General query result:', formatResponse(generalResult));

    // Test case 2: Create content strategy
    console.log('\n🔄 Testing content strategy creation...');
    const strategyResult = await router.route(
      'Create a content strategy for LinkedIn posts about AI and Machine Learning trends in 2024'
    );
    console.log('✅ Strategy routing result:', formatResponse(strategyResult));
    if (strategyResult.type === 'task') {
      const result = await strategyResult.agent.generateText({
        prompt: JSON.stringify(strategyResult.context)
      });
      console.log('✅ Strategy execution result:', formatResponse(result));
    }

    // Test case 3: Create content
    console.log('\n🔄 Testing content creation...');
    const contentResult = await router.route(
      'Create an engaging LinkedIn post about AI trends with statistics and hashtags'
    );
    console.log('✅ Content routing result:', formatResponse(contentResult));
    if (contentResult.type === 'task') {
      const result = await contentResult.agent.generateText({
        prompt: JSON.stringify(contentResult.context)
      });
      console.log('✅ Content execution result:', formatResponse(result));
    }

    // Test case 4: Research request
    console.log('\n🔄 Testing research request...');
    const researchResult = await router.route(
      'Research the latest AI trends and their impact on content creation'
    );
    console.log('✅ Research routing result:', formatResponse(researchResult));
    if (researchResult.type === 'task') {
      const result = await researchResult.agent.generateText({
        prompt: JSON.stringify(researchResult.context)
      });
      console.log('✅ Research execution result:', formatResponse(result));
    }

    // Test case 5: Content management
    console.log('\n🔄 Testing content management...');
    const managementResult = await router.route(
      'Update the statistics and hashtags in my existing LinkedIn post about AI trends'
    );
    console.log('✅ Management routing result:', formatResponse(managementResult));
    if (managementResult.type === 'task') {
      const result = await managementResult.agent.generateText({
        prompt: JSON.stringify(managementResult.context)
      });
      console.log('✅ Management execution result:', formatResponse(result));
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
  }
}

// Run the test
runContentTest(); 