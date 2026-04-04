// Check Twitter App Permissions
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: 'NchfKKavZ3GVxgPE4tQeEChpz',
  appSecret: '2AyiQby9WeWyV8S6qKvEucoGRj5Og2RldFjSJuV9SrkMu9ZKVx',
  accessToken: '2039630718599376896-JLR41n6v1r0GTxPSvNh0RLe1k3Ianm',
  accessSecret: 'i9wHTIWr0XzvJEnbxo0snzT6IyZC6EvfRpX2ktHynAqB0',
});

async function checkPermissions() {
  console.log('🔍 Checking Twitter App Permissions...\n');
  
  try {
    // Get user info
    const user = await client.v2.me();
    console.log('✅ Authentication successful');
    console.log(`👤 Username: @${user.data.username}`);
    console.log(`🆔 User ID: ${user.data.id}`);
    
    // Check if we can read tweets
    try {
      const tweets = await client.v2.userTimeline(user.data.id, { max_results: 1 });
      console.log('✅ Read access: OK');
    } catch (e) {
      console.log('❌ Read access: FAILED');
    }
    
    // Check if we can write (post a test tweet and delete it)
    try {
      const testTweet = await client.v2.tweet('Test tweet from API - ' + Date.now());
      console.log('✅ Write access: OK');
      console.log(`📝 Test tweet posted: ${testTweet.data.id}`);
      
      // Try to delete the test tweet
      try {
        await client.v2.deleteTweet(testTweet.data.id);
        console.log('✅ Delete access: OK');
      } catch (e) {
        console.log('⚠️ Delete access: Not available');
      }
    } catch (e) {
      console.log('❌ Write access: FAILED');
      console.log('\n🔧 To enable write access, you need to:');
      console.log('1. Go to https://developer.twitter.com/en/portal/dashboard');
      console.log('2. Select your app "ZeroMethodAI"');
      console.log('3. Go to "Settings" tab');
      console.log('4. Under "User authentication settings", click "Edit"');
      console.log('5. Change "App permissions" from "Read" to "Read and Write"');
      console.log('6. Save changes');
      console.log('7. Go to "Keys and tokens" tab');
      console.log('8. Regenerate "Access Token and Secret"');
      console.log('9. Update the tokens in the bot configuration');
    }
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
  }
}

checkPermissions();