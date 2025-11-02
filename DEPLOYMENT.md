# Deployment Guide for Vercel

## Quick Deploy

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```
   (Use `vercel --prod` for production)

## Environment Variables

In your Vercel project dashboard, add:
- `OPENAI_API_KEY`: Your OpenAI API key

## Or Use GitHub Integration

1. Push your code to GitHub (already done)
2. Go to https://vercel.com
3. Click "New Project"
4. Import your `ibc-accounting-mastery` repo
5. Add environment variable: `OPENAI_API_KEY`
6. Deploy!

## Project Structure

- `/api/grade.js` - Serverless function for AI grading
- `index.html` - Landing page and app
- `styles.css` - Sequoia-inspired styling
- `app.js` - Client-side app logic
- `server.js` - Local dev server (not used in production)

Vercel will automatically detect the `/api` folder and deploy serverless functions.

