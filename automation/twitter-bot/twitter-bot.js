const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

// Initialize Twitter client with Bearer Token
const client = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAFsU8wEAAAAA9ByJ8lbmzjxVTyKwxABbQR8gq5w%3DRto1vFxYkZ39yYoP0MSMXifurKlwKEeaq3NXrIg44CSGWMp9q7');

// Read-only client for search operations
const rwClient = client.readWrite;

// Content to post - All reviewed for compliance with etiquette guidelines
const tweets = [
  {
    text: `After testing dozens of AI prompt resources, I noticed a pattern:

Most are either too generic or too complex.

Here's what actually works for busy professionals:

🧵 (1/5)`,
    thread: [
      `The best prompts are:

• Specific to your actual workflow
• Tested with real use cases
• Clear enough for consistent results
• Focused on one outcome at a time (2/5)`,
      
      `That's why I created something different:

25 prompts I use daily.
Not overwhelming. Just practical.

Each saves 10+ minutes.
Email, Reports, Content, Research. (3/5)`,
      
      `No complex frameworks.
No "10,000 prompts" overwhelm.

Just 25 that work.

$19 one-time.
Updates included for a year. (4/5)`,
      
      `Want to try before you buy?

Reply "PROMPTS" and I'll DM you 3 free ones.

No obligations. Just tested tools that work.

https://thezeromethod.com (5/5)`
    ]
  },
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
    // Search for recent tweets about AI productivity
    const searchQuery = 'AI productivity OR prompt engineering OR ChatGPT tips -is:retweet lang:en';
    const tweets = await client.v2.search(searchQuery, {
      max_results: 20,
      'tweet.fields': ['author_id', 'created_at', 'public_metrics']
    });
    
    logActivity(`Found ${tweets.data.data.length} tweets to engage with`);
    
    // Like and reply to 3-5 tweets
    const tweetsToEngage = tweets.data.data.slice(0, 5);
    
    for (const tweet of tweetsToEngage) {
      // Like the tweet
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