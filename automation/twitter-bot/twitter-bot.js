const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

// Twitter API Credentials (OAuth 1.0a for posting)
const CONSUMER_KEY = 'NchfKKavZ3GVxgPE4tQeEChpz';
const CONSUMER_SECRET = '2AyiQby9WeWyV8S6qKvEucoGRj5Og2RldFjSJuV9SrkMu9ZKVx';
const ACCESS_TOKEN = '2039630718599376896-JLR41n6v1r0GTxPSvNh0RLe1k3Ianm';
const ACCESS_SECRET = 'i9wHTIWr0XzvJEnbxo0snzT6IyZC6EvfRpX2ktHynAqB0';

// Initialize Twitter client with OAuth 1.0a (full read/write access)
const client = new TwitterApi({
  appKey: CONSUMER_KEY,
  appSecret: CONSUMER_SECRET,
  accessToken: ACCESS_TOKEN,
  accessSecret: ACCESS_SECRET,
});

// Bearer Token client for search operations
const bearerClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAFsU8wEAAAAA9ByJ8lbmzjxVTyKwxABbQR8gq5w%3DRto1vFxYkZ39yYoP0MSMXifurKlwKEeaq3NXrIg44CSGWMp9q7');

// Read-write client for posting
const rwClient = client.readWrite;

// Content to post - Educational value only, no promotion until website is live
const tweets = [
  {
    text: `Prompt engineering isn't about complexity—it's about specificity.

Instead of: "Write an email"

Try: "Write a professional follow-up email to a client who hasn't responded in 3 days. Maintain a friendly but firm tone. Ask for a specific update on project status."

See the difference? 🧵`,
    thread: [
      `Most people use AI like a search engine.

They ask: "What is X?" or "How do I Y?"

But AI works best when you give it context, role, and specific instructions. (1/5)`,
      
      `Here's a framework that works every time:

1. Give it a role ("Act as a...")
2. Provide context ("Here's the situation...")
3. Be specific about output ("Format as...")
4. Add constraints ("Keep under 200 words")

Try it. (2/5)`,
      
      `Real example:

❌ "Summarize this report"
✅ "Act as a marketing director. Summarize this Q3 sales report for executives. Focus on: revenue trends, top 3 opportunities, and recommended actions. Use bullet points."

The second gets you exactly what you need. (3/5)`,
      
      `Common mistakes to avoid:
• Being too vague
• Not providing context
• Not specifying format
• Accepting first result (iterate!)

Small tweaks = Big improvements (4/5)`,
      
      `The key insight:

AI doesn't replace thinking—it amplifies it.

Your prompts reflect your clarity of thought. The clearer you are, the better results you get.

Start with one specific task. Master that. Build from there. (5/5)`
    ]
  },
  
  {
    text: `5 AI prompts that save time (no tools required):

1. "Turn this meeting transcript into action items with owners and deadlines"

2. "Rewrite this paragraph for a 5th-grade reading level"

3. "Create 5 headline options for this article"

4. "Extract key dates and deadlines from this email chain"

5. "Summarize this in 3 bullet points a busy CEO would read"

Simple. Specific. Useful.`,
  },
  
  {
    text: `Most professionals waste AI potential.

They ask generic questions and get generic answers.

The fix? Treat AI like a smart intern:

• Give context
• Explain the goal
• Specify the format
• Ask it to ask clarifying questions

Results improve 10x instantly.`,
  },
  
  {
    text: `Quick tip for better ChatGPT results:

End your prompts with:

"Ask me clarifying questions before you respond."

This forces the AI to understand your actual need instead of making assumptions.

Simple addition, massive improvement.`,
  },
  
  {
    text: `AI won't replace professionals.

Professionals who use AI will replace those who don't.

The gap isn't technical skill—it's knowing how to ask the right questions.

Start with one repetitive task this week. Optimize it.

Small wins compound.`,
  },
  
  {
    text: `Writing good prompts is like writing good emails:

• Clear subject (what you want)
• Context (why you need it)
• Specific ask (exactly what to do)
• Format (how you want it)

The skills transfer. Practice with one AI tool this week.`,
  },
  
  {
    text: `If you're new to AI tools, start here:

1. Pick ONE repetitive task (emails, reports, research)

2. Write down exactly what you do manually

3. Ask AI to do step 2, but be specific

4. Refine based on results

5. Repeat until it's faster than doing it yourself

That's it. No courses needed.`,
  }
];
  {
    text: `Quick AI productivity tip:

Instead of: "Summarize this report"

Try: "Act as a senior analyst. Summarize this quarterly report in 150 words, focusing on trends, anomalies, and Q2 recommendations."

Specificity = Better results.`,
  },
  {
    text: `Most people use ChatGPT like a search engine.

That's like using a Formula 1 car to get groceries.

Learn prompt engineering. It's the difference between:
• Generic responses
• Exactly what you need

Small skill, massive payoff.`,
  },
  {
    text: `Prompt engineering isn't about complexity.

It's about specificity.

Instead of: "Write an email"

Try: "Write a professional follow-up email to a client who hasn't responded in 3 days. Maintain a friendly but firm tone. Ask for a specific update on the project."

See the difference?`,
  },
  {
    text: `AI won't replace professionals.

Professionals who use AI will replace those who don't.

The gap is growing every day.

Start small:
• One prompt mastered
• One workflow optimized
• One hour saved

Compound over time.`,
  }
];

// Accounts to follow for research
const targetKeywords = [
  'AI productivity',
  'prompt engineering',
  'ChatGPT tips',
  'AI for business',
  'productivity tools',
  'no-code automation',
  'solopreneur'
];

// Logging
function logActivity(activity) {
  const logFile = path.join(__dirname, 'activity.log');
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${activity}\n`;
  fs.appendFileSync(logFile, logEntry);
  console.log(logEntry.trim());
}

// Post a tweet
async function postTweet(text) {
  try {
    const tweet = await client.v2.tweet(text);
    logActivity(`Tweet posted: ${tweet.data.id}`);
    return tweet;
  } catch (error) {
    logActivity(`Error posting tweet: ${error.message}`);
    throw error;
  }
}

// Post a thread
async function postThread(threadTexts) {
  try {
    let lastTweetId = null;
    const tweetIds = [];
    
    for (const text of threadTexts) {
      const tweet = lastTweetId 
        ? await client.v2.reply(text, lastTweetId)
        : await client.v2.tweet(text);
      
      lastTweetId = tweet.data.id;
      tweetIds.push(tweet.data.id);
      logActivity(`Thread tweet posted: ${tweet.data.id}`);
    }
    
    return tweetIds;
  } catch (error) {
    logActivity(`Error posting thread: ${error.message}`);
    throw error;
  }
}

// Search and engage with tweets
async function searchAndEngage() {
  try {
    // Use bearer client for search (read-only operations)
    const searchClient = bearerClient.readOnly;
    
    // Search for recent tweets about AI productivity
    const searchQuery = 'AI productivity OR prompt engineering OR ChatGPT tips -is:retweet lang:en';
    const tweets = await searchClient.v2.search(searchQuery, {
      max_results: 20,
      'tweet.fields': ['author_id', 'created_at', 'public_metrics']
    });
    
    logActivity(`Found ${tweets.data.data.length} tweets to engage with`);
    
    // Like and reply to 3-5 tweets
    const tweetsToEngage = tweets.data.data.slice(0, 5);
    
    for (const tweet of tweetsToEngage) {
      // Like the tweet using read-write client
      await client.v2.like(tweet.id);
      logActivity(`Liked tweet: ${tweet.id}`);
      
      // Wait a bit to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    return tweets.data.data.length;
  } catch (error) {
    logActivity(`Error in search and engage: ${error.message}`);
    return 0;
  }
}

// Get user info
async function getUserInfo() {
  try {
    const user = await client.v2.me();
    return user.data;
  } catch (error) {
    logActivity(`Error getting user info: ${error.message}`);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🐦 Starting Twitter Bot...\n');
  
  // Verify credentials
  const userInfo = await getUserInfo();
  if (!userInfo) {
    console.error('Failed to authenticate. Check your Bearer Token.');
    process.exit(1);
  }
  
  logActivity(`Authenticated as: ${userInfo.username}`);
  
  // Execute tasks based on time
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  
  // Post main content at specific times
  if (hour === 9 && minute < 5) {
    // Morning post (9 AM)
    logActivity('Executing morning content schedule');
    await postTweet(tweets[0].text);
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 min
    await postThread(tweets[0].thread);
  } else if (hour === 14 && minute < 5) {
    // Afternoon post (2 PM)
    logActivity('Executing afternoon content schedule');
    await postTweet(tweets[1 + Math.floor(Math.random() * 3)].text);
  } else if (hour === 19 && minute < 5) {
    // Evening post (7 PM)
    logActivity('Executing evening content schedule');
    await postTweet(tweets[4].text);
  }
  
  // Always engage with community (limited to avoid rate limits)
  if (minute % 30 === 0) { // Every 30 minutes
    logActivity('Engaging with community...');
    await searchAndEngage();
  }
  
  logActivity('Bot cycle completed\n');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  logActivity(`Unhandled error: ${error.message}`);
  console.error('Error:', error);
});

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  postTweet,
  postThread,
  searchAndEngage,
  getUserInfo
};