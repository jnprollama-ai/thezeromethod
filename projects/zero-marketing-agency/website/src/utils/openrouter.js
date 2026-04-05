// Direct fetch implementation for OpenRouter API
// SDK has auth issues, direct API is 100% reliable

const apiKey = import.meta.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.warn("⚠️ OPENROUTER_API_KEY not set");
}

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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://thezeromethod.com",
        "X-Title": "Zero Method Website"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 4000,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.choices[0]?.message?.content,
      usage: data.usage,
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
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://thezeromethod.com",
      "X-Title": "Zero Method Website"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      stream: true
    })
  });

  const reader = response.body.getReader();
  let fullResponse = "";
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = new TextDecoder().decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            fullResponse += content;
            onChunk?.(content);
          }
        } catch (e) {
          // Skip malformed chunks
        }
      }
    }
  }

  return fullResponse;
}

export { agentModels };