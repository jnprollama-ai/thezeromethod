// Test with original API key but new access tokens
const { TwitterApi } = require('twitter-api-v2');

// Original API credentials (working for read)
const client = new TwitterApi({
  appKey: 'NchfKKavZ3GVxgPE4tQeEChpz',
  appSecret: '2AyiQby9WeWyV8S6qKvEucoGRj5Og2RldFjSJuV9SrkMu9ZKVx',
  accessToken: '2039630718599376896-e7BsjGdU198lJ0e6i8U1lpk5aHnbMM',
  accessSecret: 'i6asFzo7oRP7PObYG328pZe6sqdnU6SfAPAZzIMSHOBMl',
});

async function diagnoseIssue() {
  console.log('🔍 Diagnosing Twitter API Issue...\n');
  console.log('App Key:', 'NchfKKavZ3GVxgPE4tQeEChpz');
  console.log('Access Token:', '2039630718599376896-e7BsjGdU198lJ0e6i8U1lpk5aHnbMM');
  console.log('');
  
  try {
    // Try basic app-only auth first
    const appClient = await client.v2.me();
    console.log('✅ App-only auth works');
    console.log('User:', appClient.data.username);
  } catch (e) {
    console.error('❌ App auth failed:', e.message);
    console.log('\n⚠️ This means either:');
    console.log('1. API Key/Secret are incorrect');
    console.log('2. Access Token format is wrong');
    console.log('3. App has been restricted');
    console.log('4. Tokens need more time to activate (try again in 10 minutes)');
  }
}

diagnoseIssue();