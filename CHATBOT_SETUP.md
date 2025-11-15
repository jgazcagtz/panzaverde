# Panza Verde Chatbot Setup Guide

## Overview
The Panza Verde chatbot uses DeepSeek API via Vercel serverless functions to provide intelligent customer support. The chatbot is automatically trained on your product catalog and updates in real-time when you make changes.

## Features
- ✅ DeepSeek AI integration for natural conversations
- ✅ Real-time product data synchronization
- ✅ Auto-updates when admin makes changes
- ✅ Mobile-optimized interface
- ✅ Trained specifically on Panza Verde products and information

## Setup Instructions

### 1. Get DeepSeek API Key
1. Go to [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (you'll need it for Vercel)

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Set environment variable
vercel env add DEEPSEEK_API_KEY
# Paste your DeepSeek API key when prompted
```

#### Option B: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your project
3. Go to Settings → Environment Variables
4. Add new variable:
   - Name: `DEEPSEEK_API_KEY`
   - Value: Your DeepSeek API key
5. Redeploy your project

### 3. Update Chatbot API Endpoint

After deploying to Vercel, update the API endpoint in `chatbot.js`:

```javascript
// In chatbot.js, line ~15
this.apiEndpoint = 'https://your-project.vercel.app/api/chatbot';
```

Replace `your-project` with your actual Vercel project name.

### 4. Local Development (Optional)

To test locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run local development server
vercel dev
```

The API will be available at `http://localhost:3000/api/chatbot`

## How It Works

1. **Product Sync**: The chatbot automatically subscribes to Firebase Firestore `products` collection
2. **Real-time Updates**: When you add, edit, or delete products in the admin panel, the chatbot's knowledge updates automatically
3. **AI Training**: The chatbot receives a comprehensive system prompt with:
   - All current products and prices
   - Product categories
   - Store information (shipping, payment methods, contact info)
   - Instructions on how to respond

## Customization

### Update System Prompt
Edit the `buildSystemPrompt()` function in `api/chatbot.js` to customize:
- Store information
- Response style
- Product descriptions
- Policies and procedures

### Chatbot Appearance
Customize the chatbot UI in `admin.css` (lines 1520-1828):
- Colors and gradients
- Size and positioning
- Mobile responsiveness

## Troubleshooting

### Chatbot not responding
1. Check browser console for errors
2. Verify API endpoint is correct
3. Ensure `DEEPSEEK_API_KEY` is set in Vercel
4. Check Vercel function logs

### Products not updating
1. Verify Firebase connection in browser console
2. Check that products collection exists in Firestore
3. Ensure Firestore rules allow public read access

### API errors
1. Verify DeepSeek API key is valid
2. Check API usage limits on DeepSeek dashboard
3. Review Vercel function logs for detailed errors

## Environment Variables

Required:
- `DEEPSEEK_API_KEY`: Your DeepSeek API key

## Support

For issues or questions:
- Check Vercel function logs
- Review browser console for client-side errors
- Verify Firebase Firestore connection
- Test API endpoint directly with curl or Postman

