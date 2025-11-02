# ⚡ IB Accounting Mastery

A beautiful, AI-powered quiz app for mastering Investment Banking technical accounting interview questions.

## Features

- **56 Technical Questions** across 5 categories: Income Statement, Balance Sheet, Cash Flow, Valuation, DCF & M&A
- **AI-Powered Grading**: Uses OpenAI GPT-4o-mini to evaluate your answers
- **5-Star Rating System**: Questions gain/lose stars based on your performance (1-5 stars)
- **Beautiful Zeus-Inspired UI**: Cream/off-white theme with gold accents
- **Progress Tracking**: Real-time stats on total questions, answered, and average rating
- **Local Storage**: Your progress persists across sessions

## Run

### 1. Set up OpenAI API Key

Create a `.env.local` file in the project directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Start the server

```bash
npm run dev
# Opens http://localhost:5173
```

**Note**: Grading requires the OpenAI API key to be set. The app will work without it for browsing questions, but you won't be able to submit answers for grading.

## How It Works

1. **Browse Questions**: Select a category or search for specific questions
2. **Click to Answer**: Select any question card to open the answer panel
3. **Type Your Answer**: Enter your response in the text area
4. **Get Graded**: Submit to receive AI feedback and a 1-5 rating
5. **Track Progress**: Questions adjust their star rating based on your performance (+1 if correct, -1 if incorrect)

## Files

- `index.html` - Quiz UI structure
- `styles.css` - Zeus-themed styling (cream/gold)
- `app.js` - Quiz logic, star system, API integration
- `server.js` - Node server with OpenAI API endpoint
- `package.json` - npm scripts

## Tech Stack

- Pure HTML/CSS/JavaScript
- Node.js with https module for OpenAI API
- Zero external dependencies (except OpenAI)
- Local storage for persistence

## API

The app includes a `/api/grade` endpoint that:
- Takes a question and answer
- Calls OpenAI with a grading prompt
- Returns JSON: `{ correct, feedback, score }`
