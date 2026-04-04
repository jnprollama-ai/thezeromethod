// Content Generation Agent
const fs = require('fs');
const path = require('path');

class ContentAgent {
  constructor() {
    this.twitterTemplates = [
      {
        type: 'tip',
        template: "💡 AI Tip of the Day:\n\n{tip}\n\n#AITips #Productivity #ZeroMethod",
        generator: () => {
          const tips = [
            "Save 2+ hours per week by spending 30 seconds writing context before asking AI for help.",
            "Use the 3-step framework: Context + Task + Constraints = Quality output.",
            "Always provide examples. AI learns faster from examples than descriptions.",
            "Iterate 3 times minimum. First draft is rarely the best.",
            "Ask AI to think step-by-step for complex problems."
          ];
          return tips[Math.floor(Math.random() * tips.length)];
        }
      },
      {
        type: 'mistake',
        template: "❌ Common AI Mistake:\n\n{mistake}\n\n✅ Fix: {fix}\n\n#AIMistakes #AIBestPractices",
        generator: () => {
          const mistakes = [
            { mistake: "Being too vague with prompts", fix: "Add specific details about audience, tone, and format" },
            { mistake: "Accepting first output", fix: "Treat as draft. Iterate at least 3 times" },
            { mistake: "No fact-checking", fix: "Always verify statistics and claims" },
            { mistake: "Forgetting context", fix: "Reference previous parts of conversation" },
            { mistake: "Wrong tasks for AI", fix: "Use AI for drafts, humans for judgment" }
          ];
          return mistakes[Math.floor(Math.random() * mistakes.length)];
        }
      },
      {
        type: 'question',
        template: "🤔 Question for you:\n\n{question}\n\nDrop your answer below! 👇\n\n#AI #Discussion",
        generator: () => {
          const questions = [
            "What's one AI tool that saves you the most time daily?",
            "How many hours per week do you think AI saves you?",
            "What's your biggest challenge with AI tools?",
            "Which AI feature do you wish existed?",
            "Do you fact-check AI outputs? Why or why not?"
          ];
          return questions[Math.floor(Math.random() * questions.length)];
        }
      },
      {
        type: 'framework',
        template: "🎯 The {framework}:\n\n{description}\n\nTry it and let me know your results!\n\n#AIFramework #Productivity",
        generator: () => {
          const frameworks = [
            { name: "Context-Task-Format Framework", desc: "1. Who you are\n2. What you need\n3. How you want it" },
            { name: "5W Framework", desc: "1. Who (audience)\n2. What (content)\n3. When (timeline)\n4. Where (platform)\n5. Why (purpose)" },
            { name: "Example-Edit Framework", desc: "1. Give example of what you like\n2. Ask for similar output\n3. Edit and refine" }
          ];
          const fw = frameworks[Math.floor(Math.random() * frameworks.length)];
          return { framework: fw.name, description: fw.desc };
        }
      }
    ];

    this.blogTopics = [
      "The Ultimate Guide to AI Prompt Engineering for Beginners",
      "10 AI Tools That Will Save You 5+ Hours Per Week",
      "5 Most Common AI Mistakes (And How to Avoid Them)",
      "How to Build Your Personal AI Assistant (No Coding Required)",
      "AI Productivity Secrets: What Top Performers Know",
      "The Future of Work: AI + Human Collaboration",
      "Prompt Engineering Templates You Can Use Today",
      "AI for Content Creation: Complete Workflow Guide",
      "How to Fact-Check AI Outputs (And Why You Must)",
      "Building an AI-Powered Business: Step-by-Step"
    ];
  }

  generateTwitterPost() {
    const template = this.twitterTemplates[Math.floor(Math.random() * this.twitterTemplates.length)];
    const data = template.generator();
    
    let content = template.template;
    
    if (typeof data === 'string') {
      content = content.replace('{tip}', data)
                       .replace('{question}', data);
    } else {
      content = content.replace('{mistake}', data.mistake)
                       .replace('{fix}', data.fix)
                       .replace('{framework}', data.framework)
                       .replace('{description}', data.description);
    }
    
    return {
      id: `post-${Date.now()}`,
      platform: 'twitter',
      content: content,
      status: 'draft',
      scheduledDate: null,
      postedDate: null,
      engagement: null,
      hashtags: this.extractHashtags(content),
      mediaUrl: null,
      createdAt: new Date().toISOString()
    };
  }

  generateBlogPost() {
    const topic = this.blogTopics[Math.floor(Math.random() * this.blogTopics.length)];
    const wordCount = Math.floor(Math.random() * 2000) + 2000; // 2000-4000 words
    
    return {
      id: `draft-${Date.now()}`,
      title: topic,
      status: 'draft',
      author: 'Content Agent',
      lastModified: new Date().toISOString(),
      filePath: `blog_${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`,
      wordCount: wordCount,
      readTime: `${Math.ceil(wordCount / 200)} min`,
      tags: ['AI', 'Productivity', 'Tutorial'],
      comments: [],
      createdAt: new Date().toISOString()
    };
  }

  extractHashtags(content) {
    const hashtags = [];
    const matches = content.match(/#[a-zA-Z0-9_]+/g);
    if (matches) {
      matches.forEach(tag => hashtags.push(tag));
    }
    return hashtags;
  }

  generateBlogContent(title) {
    // Generate blog content based on title
    const outlines = {
      "The Ultimate Guide to AI Prompt Engineering for Beginners": this.generatePromptEngineeringGuide(),
      "10 AI Tools That Will Save You 5+ Hours Per Week": this.generateAIToolsList(),
      "5 Most Common AI Mistakes (And How to Avoid Them)": this.generateMistakesArticle(),
      "How to Build Your Personal AI Assistant (No Coding Required)": this.generatePersonalAssistantGuide(),
      default: this.generateGenericBlog(title)
    };
    
    return outlines[title] || outlines.default;
  }

  generatePromptEngineeringGuide() {
    return `# The Ultimate Guide to AI Prompt Engineering for Beginners

## Introduction

In today's AI-powered world, knowing how to communicate effectively with AI tools is becoming essential. This guide will transform you from an AI novice to a prompt engineering pro.

## What is Prompt Engineering?

Prompt engineering is the art of crafting instructions that help AI understand exactly what you want. Think of it as learning to ask the right questions to get the best answers.

## The 5 Elements of Great Prompts

1. **Context** - Who you are and what you're trying to achieve
2. **Specific Task** - Crystal clear about what you want
3. **Format** - How you want output structured
4. **Tone and Style** - The voice you're looking for
5. **Constraints** - Clear boundaries and limitations

## Real Examples

[Examples and case studies would be here...]

## Conclusion

Master these principles and you'll be ahead of 90% of AI users.

---

*Ready to dive deeper? Follow @ZeroMethodAI for daily tips.*`;
  }

  generateAIToolsList() {
    return `# 10 AI Tools That Will Save You 5+ Hours Per Week

## Introduction

Imagine having an extra 5 hours every week. That's 260 hours per year - over 6 full work weeks!

## The Tools

1. **ChatGPT** - Conversational AI for writing and brainstorming
2. **Grammarly** - AI writing assistant
3. **Canva AI** - Design automation
4. **Midjourney** - AI image generation
5. **Perplexity** - AI search engine
6. **Otter.ai** - Meeting transcription
7. **Zapier AI** - Workflow automation
8. **Notion AI** - Knowledge management
9. **Descript** - Video editing
10. **Reclaim.ai** - Calendar management

## Cost Breakdown

All these tools have free tiers. Total cost: $0-20/month.

## Conclusion

Start with one tool. Master it. Add another.

---

*Follow @ZeroMethodAI for more tool recommendations.*`;
  }

  generateMistakesArticle() {
    return `# 5 Most Common AI Mistakes

## Mistake #1: Being Too Vague

❌ "Write about marketing"
✅ "Write 500 words on email marketing for SaaS founders"

## Mistake #2: Accepting First Output

Treat AI output as a first draft. Always iterate.

## Mistake #3: No Fact-Checking

AI can hallucinate. Always verify facts independently.

## Mistake #4: Forgetting Context

Reference previous parts of conversation.

## Mistake #5: Wrong Tasks

Use AI for drafts. Use humans for judgment.

## Conclusion

Avoid these 5 mistakes and you'll be ahead of 90% of users.

---

*Get weekly AI tips at @ZeroMethodAI*`;
  }

  generatePersonalAssistantGuide() {
    return `# How to Build a Personal AI Assistant

## Step 1: Set Up Your Foundation

You'll need:
- ChatGPT Plus ($20/month)
- Notion (free)
- Zapier (free tier)

## Step 2: Build Your Knowledge Base

Create an "About Me" document with your professional info, communication style, and content examples.

## Step 3: Create Custom GPT

Configure your assistant in ChatGPT with your knowledge base.

## Step 4: Set Up Automations

Connect your tools with Zapier to automate repetitive tasks.

## Conclusion

You don't need coding skills to have an AI assistant.

---

*Build along with us @ZeroMethodAI*`;
  }

  generateGenericBlog(title) {
    return `# ${title}

## Introduction

This comprehensive guide will help you master ${title.toLowerCase()}.

## What You'll Learn

- Key concepts and strategies
- Real-world applications
- Actionable tips you can use today

## Main Content

[Detailed content would be here...]

## Conclusion

Start applying these principles today and see results.

---

*Follow @ZeroMethodAI for more insights.*`;
  }
}

module.exports = ContentAgent;