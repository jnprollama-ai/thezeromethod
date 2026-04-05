// Simple test script for OpenRouter SDK
// Run: node test-openrouter.js

import { OpenRouter } from "@openrouter/sdk";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error("❌ OPENROUTER_API_KEY not set");
  console.log("Set it with: export OPENROUTER_API_KEY='sk-or-xxxx'");
  process.exit(1);
}

const openrouter = new OpenRouter({ apiKey });

const models = [
  { name: "Claude Sonnet", id: "openrouter/claude-sonnet-4.6" },
  { name: "GLM-5V Turbo", id: "z-ai/glm-5v-turbo" },
  { name: "Qwen 3.6 Plus", id: "qwen/qwen3.6-plus:free" },
  { name: "Gemma 4 26B", id: "google/gemma-4-26b-a4b-it" }
];

console.log("🧪 Testing OpenRouter SDK...\n");

for (const model of models) {
  try {
    console.log(`Testing ${model.name} (${model.id})...`);
    
    const response = await openrouter.chat.complete({
      model: model.id,
      messages: [
        { role: "system", content: "You are a helpful assistant. Keep responses very brief." },
        { role: "user", content: "Say hello in one word." }
      ],
      max_tokens: 10
    });

    const content = response.choices[0]?.message?.content;
    console.log(`✅ ${model.name}: "${content?.trim()}"`);
    console.log(`   Tokens: ${response.usage?.total_tokens || 'N/A'}\n`);
  } catch (error) {
    console.log(`❌ ${model.name}: ${error.message}\n`);
  }
}

console.log("✨ Test complete!");