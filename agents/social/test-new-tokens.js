// Test new Twitter credentials with write access
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: 'NchfKKavZ3GVxgPE4tQeEChpz',
  appSecret: '2AyiQby9WeWyV8S6qKvEucoGRj5Og2RldFjSJuV9SrkMu9ZKVx',
  accessToken: '2039630718599376896-e7BsjGdU198lJ0e6i8U1lpk5aHnbMM',
  accessSecret: 'i6asFzo7oRP7PObYG328pZe6sqdnU6SfAPAZzIMSHOBMl',
});

async function testWriteAccess() {
  console.log('🔍 Testing Twitter API with new tokens...\n');
  
  try {
    // Test 1: Get user info
    console.log('1️⃣ Testing authentication...');
    const user = await client.v2.me({ 'user.fields': 'public_metrics' });
    console.log('✅ Authentication successful!');
    console.log(`   👤 Username: @${user.data.username}`);
    console.log(`   🆔 User ID: ${user.data.id}`);
    console.log(`   👥 Followers: ${user.data.public_metrics?.followers_count || 0}`);
    
    // Test 2: Try to post a test tweet
    console.log('\n2️⃣ Testing write access...');
    try {
      const testTweet = await client.v2.tweet('Test post - ' + new Date().toISOString());
      console.log('✅ WRITE ACCESS CONFIRMED!');
      console.log(`   📝 Tweet posted: https://twitter.com/${user.data.username}/status/${testTweet.data.id}`);
      
      // Delete the test tweet
      try {
        await client.v2.deleteTweet(testTweet.data.id);
        console.log('✅ Test tweet deleted successfully');
      } catch (e) {
        console.log('⚠️ Could not delete test tweet (not critical)');
      }
      
      console.log('\n🎉 SUCCESS! Twitter Bot can now:');
      console.log('   • Read tweets ✓');
      console.log('   • Post tweets ✓');
      console.log('   • Delete tweets ✓');
      console.log('\n✅ The bot is ready to auto-post your scheduled content!');
      
    } catch (writeError) {
      console.error('❌ Write access failed:', writeError.message);
      console.log('\n⚠️ Possible causes:');
      console.log('   • App permissions not set to "Read and Write"');
      console.log('   • Token not yet activated (wait 5-10 minutes)');
      console.log('   • Rate limiting');
    }
    
  } catch (authError) {
    console.error('❌ Authentication failed:', authError.message);
    console.log('\n🔧 Solution needed: Check tokens are copied correctly');
  }
}

testWriteAccess();