const env = require('./environment');
const logger = require('./logger');

async function callAzureOpenAI(messages, options = {}) {
  const endpoint = env.AZURE_OPENAI_ENDPOINT;
  const apiKey = env.AZURE_OPENAI_KEY;
  const deploymentName = env.AZURE_OPENAI_DEPLOYMENT_NAME;
  const apiVersion = env.AZURE_OPENAI_API_VERSION;

  if (!endpoint || !apiKey) {
    logger.warn('Azure OpenAI credentials not configured. Returning fallback response.');
    return {
      content: 'I apologize, but I am not able to provide AI-powered responses right now because the AI service has not been configured yet. Please ask your administrator to set up the Azure OpenAI credentials.',
      tokensUsed: 0,
      model: 'fallback',
    };
  }

  const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 0.9,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(`Azure OpenAI API error: ${response.status} ${errorBody}`);
      throw new Error(`Azure OpenAI API returned status ${response.status}`);
    }

    const data = await response.json();
    const choice = data.choices && data.choices[0];

    return {
      content: choice ? choice.message.content : 'No response generated.',
      tokensUsed: data.usage ? data.usage.total_tokens : 0,
      model: deploymentName,
    };
  } catch (error) {
    logger.error('Azure OpenAI call failed:', { message: error.message });
    return {
      content: 'I am sorry, I encountered an issue connecting to the AI service. Please try again in a moment.',
      tokensUsed: 0,
      model: 'error',
    };
  }
}

module.exports = { callAzureOpenAI };
