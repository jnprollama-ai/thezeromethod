import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
});

// Agent model assignments based on role
const agentModels = {
  rex: "openrouter/claude-sonnet-4.6",        // Architecture - complex reasoning
  vesper: "z-ai/glm-5v-turbo",                // Homepage - creative design
  mace: "openrouter/claude-sonnet-4.6",       // Payments - technical precision
  lena: "qwen/qwen3.6-plus:free",             // Blog - content, cost-effective
  drift: "google/gemma-4-26b-a4b-it",         // Components - code generation
  flux: "z-ai/glm-5v-turbo",                  // Animations - creative motion
  vault: "openrouter/claude-sonnet-4.6",      // Security - thorough testing
  scout: "qwen/qwen3.6-plus:free"             // SEO - data analysis
};

export async function callAgent(agentId, systemPrompt, userPrompt, options = {}) {
  const model = agentModels[agentId] || "openrouter/claude-sonnet-4.6";
  
  try {
    const response = await openrouter.chat.complete({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4000,
      stream: options.stream ?? false
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content,
      usage: response.usage,
      model
    };
  } catch (error) {
    console.error(`Agent ${agentId} failed:`, error);
    return {
      success: false,
      error: error.message,
      model
    };
  }
}

export async function streamAgent(agentId, systemPrompt, userPrompt, onChunk) {
  const model = agentModels[agentId] || "openrouter/claude-sonnet-4.6";
  
  const stream = await openrouter.chat.send({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    stream: true
  });

  let fullResponse = "";
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      fullResponse += content;
      onChunk?.(content);
    }
  }

  return fullResponse;
}

export { agentModels };