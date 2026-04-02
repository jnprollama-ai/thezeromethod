#!/usr/bin/env node
/**
 * Website Improvement Agent
 * Spawns autonomous subagents for website updates
 */

const tasks = [
  {
    name: "SEO Audit Agent",
    description: "Analyze website SEO and implement improvements",
    instructions: `
      1. Fetch thezeromethod.com and analyze SEO elements
      2. Check meta tags, headings, content structure
      3. Identify improvement opportunities
      4. Update website files with SEO optimizations
      5. Commit changes to GitHub
      6. Report what was improved
    `
  },
  {
    name: "Content Creation Agent", 
    description: "Create blog posts and marketing content",
    instructions: `
      1. Research AI productivity topics trending now
      2. Write blog post drafts (3-5 per week)
      3. Create social media content snippets
      4. Update website blog section
      5. Commit to GitHub
      6. Report content created
    `
  },
  {
    name: "Conversion Optimization Agent",
    description: "Optimize landing pages for conversions",
    instructions: `
      1. Analyze current landing page performance
      2. Review copy and CTAs
      3. Propose A/B test variations
      4. Implement improvements to copy/design
      5. Commit to GitHub
      6. Report changes made
    `
  },
  {
    name: "Marketing Research Agent",
    description: "Research market and competitors",
    instructions: `
      1. Research AI productivity market trends
      2. Analyze 3-5 competitor websites
      3. Identify content gaps and opportunities
      4. Create competitive analysis report
      5. Propose differentiation strategies
      6. Report findings
    `
  }
];

// Export for OpenClaw to use
module.exports = { tasks };
