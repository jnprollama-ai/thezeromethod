# Twitter App Configuration Guide

## App Setup Details

### App Type
**Select: "Web App, Automated Bot or Bot"**

This is the correct type for a server-based bot that will post tweets automatically.

### Callback URI / Redirect URL
**Primary:** `http://localhost:3456/callback`

**Note:** Since this is a bot that doesn't need user login flow, the callback URL won't be actively used, but Twitter requires it for OAuth 2.0 configuration.

### Website URL
**Enter:** `https://thezeromethod.com`

This should be your official website where users can learn more about your bot/service.

---

## Step-by-Step Configuration

### Step 1: Basic Info
- **App name:** ZeroMethodAI
- **Application description:** AI-powered content automation and social media management bot for Zero Method
- **Website URL:** https://thezeromethod.com
- **Callback URLs:** http://localhost:3456/callback
- **Organization name:** (optional) Zero Method
- **Organization website:** (optional) https://thezeromethod.com

### Step 2: App Permissions (Critical!)
After creating the app:
1. Go to "Settings" tab
2. Click "Edit" under "User authentication settings"
3. Set these permissions:

   | Setting | Value |
   |---------|-------|
   | OAuth 2.0 | **ON** |
   | OAuth 1.0a | **ON** |
   | App permissions | **Read and Write** |
   | Type of App | **Web App, Automated Bot or Bot** |
   | Callback URI | http://localhost:3456/callback |
   | Website URL | https://thezeromethod.com |

### Step 3: Get Your Keys
After setting up, go to "Keys and tokens" tab:

**API Key (Consumer Key):**
```
NchfKKavZ3GVxgPE4tQeEChpz
```

**API Key Secret (Consumer Secret):**
```
2AyiQby9WeWyV8S6qKvEucoGRj5Og2RldFjSJuV9SrkMu9ZKVx
```

**Access Token:** (you'll regenerate this)

**Access Token Secret:** (you'll regenerate this)

---

## What Each Permission Does

### Read (Current)
- ✅ Read tweets
- ✅ Read user profiles
- ✅ Read follower counts
- ❌ Cannot post tweets
- ❌ Cannot like/retweet

### Read and Write (What you need)
- ✅ Everything in Read
- ✅ Post new tweets
- ✅ Delete tweets
- ✅ Like tweets
- ✅ Retweet
- ✅ Follow/unfollow users
- ✅ Send direct messages

---

## After Configuration

1. Click "Save" at the bottom
2. Go to "Keys and tokens" tab
3. Click "Regenerate" next to Access Token & Secret
4. Copy the new tokens
5. Update the bot configuration
6. Restart Command Center

---

## Troubleshooting

### If you get "Callback URL not approved"
- Make sure you've entered the callback URL in the settings
- Wait 5-10 minutes for Twitter to process the changes

### If permissions don't save
- Ensure you've toggled OAuth 2.0 or OAuth 1.0a to ON
- The "Read and Write" option only appears when OAuth is enabled

### If tokens don't work after regenerating
- Make sure you copied the FULL token (they're long!)
- Ensure no extra spaces at beginning or end
- Try regenerating one more time