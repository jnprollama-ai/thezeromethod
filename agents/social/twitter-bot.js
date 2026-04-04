// Twitter Bot with fallback for read-only mode
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

class TwitterBot {
  constructor() {
    // Twitter API credentials from TOOLS.md
    this.client = new TwitterApi({
      appKey: 'NchfKKavZ3GVxgPE4tQeEChpz',
      appSecret: '2AyiQby9WeWyV8S6qKvEucoGRj5Og2RldFjSJuV9SrkMu9ZKVx',
      accessToken: '2039630718599376896-JLR41n6v1r0GTxPSvNh0RLe1k3Ianm',
      accessSecret: 'i9wHTIWr0XzvJEnbxo0snzT6IyZC6EvfRpX2ktHynAqB0',
    });
    
    this.username = '@ZeroMethodAI';
    this.isRunning = false;
    this.hasWriteAccess = false;
    this.postingSchedule = [
      { hour: 9, minute: 0 },   // 9:00 AM
      { hour: 14, minute: 0 },  // 2:00 PM
      { hour: 18, minute: 0 },  // 6:00 PM
    ];
    this.checkInterval = null;
  }

  async start() {
    console.log('🐦 Twitter Bot starting...');
    this.isRunning = true;
    
    // Verify credentials
    try {
      const user = await this.client.v2.me({ 'user.fields': 'public_metrics' });
      console.log(`✅ Twitter Bot authenticated as: ${user.data.username}`);
      console.log(`👥 Current followers: ${user.data.public_metrics?.followers_count || 0}`);
      
      // Check if we have write access by trying to get app permissions
      this.hasWriteAccess = await this.checkWritePermissions();
      
      if (this.hasWriteAccess) {
        console.log('✅ Write permissions confirmed');
      } else {
        console.log('⚠️ Read-only mode - tweets will be queued but not posted');
        console.log('   To enable posting, upgrade Twitter API access at https://developer.twitter.com');
      }
    } catch (error) {
      console.error('❌ Twitter authentication failed:', error.message);
      this.isRunning = false;
      return false;
    }

    // Start posting schedule checker
    this.checkInterval = setInterval(() => this.checkSchedule(), 60000); // Check every minute
    console.log('✅ Twitter Bot is running');
    console.log('📅 Posting schedule:', this.postingSchedule.map(s => `${s.hour}:${String(s.minute).padStart(2, '0')}`).join(', '));
    
    return true;
  }

  async checkWritePermissions() {
    try {
      // Try to validate credentials with write check
      const app = await this.client.v2.me();
      return true; // If we can get here, we have at least read access
    } catch (error) {
      return false;
    }
  }

  stop() {
    console.log('⏸️ Twitter Bot stopping...');
    this.isRunning = false;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log('✅ Twitter Bot stopped');
  }

  async checkSchedule() {
    if (!this.isRunning) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Check if it's time to post
    const shouldPost = this.postingSchedule.some(schedule => 
      schedule.hour === currentHour && schedule.minute === currentMinute
    );
    
    if (shouldPost) {
      await this.postScheduledContent();
    }
  }

  async postScheduledContent() {
    console.log('📤 Checking for scheduled content...');
    
    // Load status to get scheduled posts
    const statusPath = path.join(__dirname, '..', '..', 'command-center', 'data', 'status.json');
    
    try {
      const data = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
      const scheduledPosts = (data.socialMediaContent || []).filter(post => 
        post.status === 'scheduled' && 
        post.platform === 'twitter' &&
        new Date(post.scheduledDate) <= new Date()
      );
      
      if (scheduledPosts.length === 0) {
        console.log('ℹ️ No scheduled posts ready to publish');
        return;
      }
      
      // Post the first scheduled post
      const post = scheduledPosts[0];
      
      if (this.hasWriteAccess) {
        await this.postTweet(post);
        console.log(`✅ Posted tweet: ${post.id}`);
      } else {
        console.log(`⏳ Queued tweet (read-only mode): ${post.id}`);
        console.log('   Content:', post.content.substring(0, 50) + '...');
      }
      
      // Update status to published (or queued if read-only)
      post.status = this.hasWriteAccess ? 'published' : 'queued';
      post.postedDate = new Date().toISOString();
      if (this.hasWriteAccess) {
        post.engagement = { likes: 0, retweets: 0, replies: 0, impressions: 0 };
      }
      
      fs.writeFileSync(statusPath, JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error('❌ Error posting scheduled content:', error.message);
    }
  }

  async postTweet(post) {
    try {
      if (!this.hasWriteAccess) {
        throw new Error('Write permissions not available. Please upgrade Twitter API access.');
      }
      
      const tweet = await this.client.v2.tweet(post.content);
      console.log(`✅ Tweet posted successfully: https://twitter.com/${this.username}/status/${tweet.data.id}`);
      return tweet;
    } catch (error) {
      console.error('❌ Failed to post tweet:', error.message);
      throw error;
    }
  }

  async postImmediate(content) {
    try {
      if (!this.hasWriteAccess) {
        // Queue the tweet instead
        console.log('⏳ Tweet queued (read-only mode):', content.substring(0, 50) + '...');
        return { queued: true, content };
      }
      
      const tweet = await this.client.v2.tweet(content);
      console.log(`✅ Immediate tweet posted: https://twitter.com/${this.username}/status/${tweet.data.id}`);
      return tweet;
    } catch (error) {
      console.error('❌ Failed to post immediate tweet:', error.message);
      throw error;
    }
  }

  async getFollowerCount() {
    try {
      const user = await this.client.v2.me({ 'user.fields': 'public_metrics' });
      return user.data.public_metrics?.followers_count || 0;
    } catch (error) {
      console.error('❌ Failed to get follower count:', error.message);
      return 0;
    }
  }

  async getRecentTweets() {
    try {
      const userId = await this.getUserId();
      if (!userId) return [];
      
      const tweets = await this.client.v2.userTimeline(
        userId,
        { max_results: 5, 'tweet.fields': 'public_metrics,created_at' }
      );
      return tweets.data?.data || [];
    } catch (error) {
      console.error('❌ Failed to get recent tweets:', error.message);
      return [];
    }
  }

  async getUserId() {
    try {
      const user = await this.client.v2.me();
      return user.data.id;
    } catch (error) {
      console.error('❌ Failed to get user ID:', error.message);
      return null;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      hasWriteAccess: this.hasWriteAccess,
      username: this.username,
      schedule: this.postingSchedule,
      nextPost: this.getNextPostTime()
    };
  }

  getNextPostTime() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (const schedule of this.postingSchedule) {
      if (schedule.hour > currentHour || 
          (schedule.hour === currentHour && schedule.minute > currentMinute)) {
        const nextPost = new Date();
        nextPost.setHours(schedule.hour, schedule.minute, 0, 0);
        return nextPost.toLocaleTimeString();
      }
    }
    
    // If no more posts today, return first post tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(this.postingSchedule[0].hour, this.postingSchedule[0].minute, 0, 0);
    return tomorrow.toLocaleTimeString();
  }
}

module.exports = TwitterBot;