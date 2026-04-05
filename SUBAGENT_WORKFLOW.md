# Subagent Workflow Management System

## Overview
Clear workflow definitions for managing subagents in the Command Center.

## Agent Types & Pokemon Assignments

### 1. PDF-Design-Expert
- **Pokemon**: Alakazam (🥄)
- **Function**: Creates professional PDF documents
- **Role**: Document Specialist
- **Primary Model**: Claude-4.6-Sonnet (OpenRouter)
- **Fallback Models**: GPT-4, Gemini-1.5-Pro
- **API**: OpenRouter
- **Workflow**: 
  1. Receive markdown content
  2. Format with professional design
  3. Apply Zero Method branding
  4. Generate print-ready PDF
  5. Save to downloads folder

### 2. Coding-Expert
- **Pokemon**: Porygon (🔷)
- **Function**: Code review and optimization
- **Role**: Code Specialist
- **Primary Model**: Claude-4.6-Sonnet (OpenRouter)
- **Fallback Models**: GPT-4, CodeLlama
- **API**: OpenRouter
- **Workflow**:
  1. Analyze codebase
  2. Identify improvement areas
  3. Implement best practices
  4. Test functionality
  5. Document changes

### 3. Command-Center-Enhancement
- **Pokemon**: Rapidash (🐴)
- **Function**: UI/UX improvements and system integration
- **Role**: UI Specialist
- **Primary Model**: Claude-4.6-Sonnet (OpenRouter)
- **Fallback Models**: GPT-4
- **API**: OpenRouter
- **Workflow**:
  1. Analyze current UI
  2. Design improvements
  3. Implement changes
  4. Test responsiveness
  5. Update documentation

### 4. Research-Analyst
- **Pokemon**: Mewtwo (🧬)
- **Function**: Market research and competitor analysis
- **Role**: Research Specialist
- **Primary Model**: Claude-4.6-Sonnet (OpenRouter)
- **Fallback Models**: GPT-4, Gemini-1.5-Pro
- **API**: OpenRouter
- **Workflow**:
  1. Define research scope
  2. Gather data from sources
  3. Analyze findings
  4. Generate report
  5. Present recommendations

### 5. Content-Creator
- **Pokemon**: Jigglypuff (🎵)
- **Function**: Blog posts and marketing content
- **Role**: Content Specialist
- **Primary Model**: Claude-4.6-Sonnet (OpenRouter)
- **Fallback Models**: GPT-4, Gemini-1.5-Pro
- **API**: OpenRouter
- **Workflow**:
  1. Receive content brief
  2. Research topic
  3. Create draft
  4. Optimize for SEO
  5. Finalize and publish

### 6. Social-Media-Manager
- **Pokemon**: Gyarados (🐉)
- **Function**: Social media automation and engagement
- **Role**: Social Specialist
- **Primary Model**: Claude-4.6-Sonnet (OpenRouter)
- **Fallback Models**: GPT-4
- **API**: OpenRouter + Twitter API
- **Workflow**:
  1. Schedule posts
  2. Monitor engagement
  3. Respond to mentions
  4. Analyze metrics
  5. Adjust strategy

## Model Management

### Available Models by Provider

**OpenRouter (Primary)**
- Claude-4.6-Sonnet ⭐ (Default for most tasks)
- Claude-3-Opus (Complex reasoning)
- GPT-4 (General purpose)
- GPT-3.5-turbo (Fast, cost-effective)
- Llama-3-70B (Open source)
- Gemini-1.5-Pro (Google)

**OpenAI**
- GPT-4
- GPT-3.5-turbo

**Anthropic**
- Claude-3-Opus
- Claude-3-Sonnet

**Google**
- Gemini-1.5-Pro
- Gemini-1.5-Flash

**Ollama (Local)**
- qwen3-coder:480b-cloud
- kimi-k2.5:cloud
- llama3:latest

### Model Selection Criteria

1. **Task Complexity**
   - Simple tasks: GPT-3.5-turbo, Gemini-Flash
   - Medium tasks: GPT-4, Claude-3-Sonnet
   - Complex tasks: Claude-4.6-Sonnet, Claude-3-Opus

2. **Cost Considerations**
   - Budget mode: Ollama local models
   - Balanced: GPT-3.5-turbo
   - Premium: Claude-4.6-Sonnet

3. **Speed Requirements**
   - Fast response: GPT-3.5-turbo, Gemini-Flash
   - Quality over speed: Claude-4.6-Sonnet

## Task Assignment Workflow

### Step 1: Task Creation
```
1. Define task objective
2. Select agent type based on expertise
3. Choose appropriate model
4. Set priority (Low/Medium/High)
5. Set deadline
```

### Step 2: Agent Selection
```
1. Check agent availability
2. Verify agent capabilities match task
3. Confirm model is available
4. Assign task to agent
5. Notify agent of new task
```

### Step 3: Task Execution
```
1. Agent reviews task requirements
2. Agent confirms understanding
3. Agent begins work
4. Progress updates sent to Command Center
5. Agent completes task
```

### Step 4: Task Completion
```
1. Agent submits deliverables
2. Quality check performed
3. Task marked as complete
4. Results stored in appropriate location
5. Agent status updated to idle
```

## API Management

### Configuration
```javascript
{
  openrouter: {
    key: "sk-or-...",
    endpoint: "https://openrouter.ai/api/v1",
    models: ["claude-4.6-sonnet", "gpt-4", "llama-3-70b"]
  },
  openai: {
    key: "sk-...",
    endpoint: "https://api.openai.com/v1",
    models: ["gpt-4", "gpt-3.5-turbo"]
  },
  anthropic: {
    key: "sk-ant-...",
    endpoint: "https://api.anthropic.com/v1",
    models: ["claude-3-opus", "claude-3-sonnet"]
  },
  google: {
    key: "AIza...",
    endpoint: "https://generativelanguage.googleapis.com/v1",
    models: ["gemini-1.5-pro"]
  },
  ollama: {
    endpoint: "http://127.0.0.1:11434",
    models: ["qwen3-coder:480b-cloud", "kimi-k2.5:cloud"]
  }
}
```

### Security
- API keys stored in .env file
- Never exposed to frontend
- Last 4 chars visible in UI for identification
- Encryption at rest

## Cost Tracking

### Per-Model Costs (Approximate)
- GPT-3.5-turbo: $0.0015/1K tokens
- GPT-4: $0.03/1K tokens
- Claude-4.6-Sonnet: $0.03/1K tokens
- Claude-3-Opus: $0.015/1K tokens
- Ollama local: $0 (self-hosted)

### Budget Management
- Daily spending limit: $10
- Monthly budget: $50
- Alerts at 80% usage
- Automatic switching to cheaper models when budget low

## Status Definitions

- **Active**: Agent online and ready for tasks
- **Idle**: Agent online but no current task
- **Busy**: Agent currently working on task
- **Offline**: Agent not connected
- **Error**: Agent encountered error

## Command Center UI

### Main Dashboard
- Real-time agent status
- Task queue overview
- Cost tracking
- Model availability

### Agent Detail View
- Full agent profile
- Task history
- Token usage graphs
- Model performance metrics

### Settings Panel
- API key management
- Model preferences
- Budget limits
- Notification settings