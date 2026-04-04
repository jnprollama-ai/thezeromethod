// Test OAuth 2.0 authentication
const { TwitterApi } = require('twitter-api-v2');

// Try OAuth 2.0 Client Credentials
const client = new TwitterApi({
  clientId: 'b0FtX0d3RVdLbEV0YTN5dXJreEs6MTpjaQ',
  clientSecret: 'yn-lFTKJEQ-JGKV69NlXyH7vzCWQsgA1Fe_Wb59fUo7BWUAs38',
});

async function testOAuth2() {
  console.log('🔍 Testing OAuth 2.0 authentication...\n');
  
  try {
    // OAuth 2.0 App-only authentication
    const appClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    const appUser = await appClient.v2.me({ 'user.fields': 'public_metrics' });
    console.log('✅ OAuth 2.0 App Auth successful!');
    console.log(`   👤 App user: ${appUser.data.username}`);
    console.log(`   👥 Followers: ${appUser.data.public_metrics?.followers_count || 0}`);
    
    // Try to post (this will likely fail without user context)
    console.log('\n📝 Testing OAuth 2.0 write access...');
    try {
      const tweet = await appClient.v2.tweet('Test OAuth 2.0 post - ' + new Date().toISOString());
      console.log('✅ OAuth 2.0 write access confirmed!');
      console.log(`   📝 Tweet: https://twitter.com/${appUser.data.username}/status/${tweet.data.id}`);
    } catch (writeError) {
      console.log('⚠️ OAuth 2.0 write access failed (expected for app-only auth)');
      console.log('   OAuth 2.0 app-only auth can read but not post');
      console.log('   Need OAuth 1.0a user context for posting');
    }
    
  } catch (error) {
    console.error('❌ OAuth 2.0 authentication failed:', error.message);
  }
  
  console.log('\n🔄 Trying OAuth 1.0a with new credentials...\n');
  
  // Try OAuth 1.0a with new credentials
  const userClient = new TwitterApi({
    appKey: 'b0FtX0d3RVdLbEV0YTN5dXJreEs6MTpjaQ',
    appSecret: '4MvDscmsgJJ1dLjDXTVyUJ4vCApj4lCoSNNtwvamJCI5gQk7ra',
    accessToken: '2039630718599376896-uhj4ZKekjd6ZJxTNV6R0h1v6YgYDfu',
    accessSecret: 'BTfxyBS2PY6rhmSiSrfRL5IUCs76FT1z6tj5DUq1tDO5q',
  });
  
  try {
    const user = await userClient.v2.me({ 'user.fields': 'public_metrics' });
    console.log('✅ OAuth 1.0a authentication successful!');
    console.log(`   👤 User: ${user.data.username}`);
    console.log(`   🆔 ID: ${user.data.id}`);
    
    // Try to post
    console.log('\n📝 Testing OAuth 1.0a write access...');
    try {
      const tweet = await userClient.v2.tweet('Test OAuth 1.0a post - ' + new Date().toISOString());
      console.log('✅ OAuth 1.0a write access confirmed!');
      console.log(`   📝 Tweet: https://twitter.com/${user.data.username}/status/${tweet.data.id}`);
      
      // Clean up
      try {
        await userClient.v2.deleteTweet(tweet.data.id);
        console.log('✅ Test tweet deleted');
      } catch (e) {
        console.log('⚠️ Could not delete test tweet');
      }
      
    } catch (writeError) {
      console.log('❌ OAuth 1.0a write access failed:', writeError.message);
    }
    
  } catch (userError) {
    console.error('❌ OAuth 1.0a authentication failed:', userError.message);
  }
}

testOAuth2();