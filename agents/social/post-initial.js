// Script to post initial tweet
const TwitterBot = require('./twitter-bot');

const bot = new TwitterBot();

async function postInitialTweet() {
  try {
    await bot.start();
    
    const tweet = `🚀 Just launched Zero Method! 

Building AI-powered tools and sharing what we learn along the way.

Follow for:
✨ AI productivity tips
🤖 Prompt engineering guides  
💡 Business automation ideas

Let's build something amazing together!

#AI #Productivity #ZeroMethod #BuildInPublic`;
    
    await bot.postImmediate(tweet);
    console.log('✅ Initial tweet posted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to post initial tweet:', error);
    process.exit(1);
  }
}

postInitialTweet();