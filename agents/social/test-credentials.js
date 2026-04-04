// Test new Twitter credentials
const { TwitterApi } = require('twitter-api-v2');

// New credentials from user
const client = new TwitterApi({
  appKey: 'lhR9Suc15RdYNqImAHvXiylwE',
  appSecret: 'Tzs2Tcx8xqIzpRcZz7343kxg5aI11U12gdbejEWzdmFYNHUsVD',
  accessToken: '2039630718599376896-i7amETJaw5gAHlxS7yIkMpDktd1B68',
  accessSecret: 'eNmDSaAIK9wVRVCGpf72PFpPA2LebAKqdaRFFylhlcKxe',
});

async function testCredentials() {
  console.log('🔍 Testing new Twitter credentials...\n');
  
  try {
    // Test read access
    const user = await client.v2.me({ 'user.fields': 'public_metrics' });
    console.log('✅ Authentication successful!');
    console.log(`👤 Username: @${user.data.username}`);
    console.log(`🆔 User ID: ${user.data.id}`);
    console.log(`👥 Followers: ${user.data.public_metrics?.followers_count || 0}`);
    
    // Test write access by attempting to post (we'll delete it immediately)
    console.log('\n📝 Testing write access...');
    try {
      const testTweet = await client.v2.tweet('Test tweet - ' + Date.now());
      console.log('✅ Write access confirmed!');
      console.log(`✅ Tweet posted: https://twitter.com/${user.data.username}/status/${testTweet.data.id}`);
      
      // Delete the test tweet
      try {
        await client.v2.deleteTweet(testTweet.data.id);
        console.log('✅ Test tweet deleted successfully');
      } catch (e) {
        console.log('⚠️ Could not delete test tweet:', e.message);
      }
      
      console.log('\n🎉 All tests passed! The bot is ready to post.');
    } catch (writeError) {
      console.error('❌ Write access failed:', writeError.message);
      console.log('\n⚠️ The tokens work for reading, but not for writing.');
      console.log('   You may need to regenerate the Access Token again after setting permissions to "Read and Write".');
    }
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('\n⚠️ Possible issues:');
    console.log('   1. Tokens may have expired');
    console.log('   2. Tokens were copied incorrectly');
    console.log('   3. App permissions not properly set');
    console.log('\n🔧 Solution: Regenerate tokens at https://developer.twitter.com/en/portal/dashboard');
  }
}

testCredentials();