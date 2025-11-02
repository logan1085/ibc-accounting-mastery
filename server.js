const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;

// Load .env.local if it exists
let OPENAI_API_KEY = process.env.OPENAI_API_KEY;
try {
  const envFile = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
  const match = envFile.match(/OPENAI_API_KEY=(.+)/);
  if (match) OPENAI_API_KEY = match[1].trim();
} catch (e) {
  // .env.local doesn't exist, use environment variable
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

function send(res, status, content, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(content);
}

function sendJSON(res, status, obj) {
  send(res, status, JSON.stringify(obj), 'application/json');
}

function callOpenAI(prompt, callback) {
  if (!OPENAI_API_KEY) {
    callback(new Error('OpenAI API key not configured'));
    return;
  }

  const data = JSON.stringify({
    model: 'gpt-5',
    messages: [{ role: 'user', content: prompt }],
    max_completion_tokens: 1000
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => { body += chunk; });
    res.on('end', () => {
      try {
        const result = JSON.parse(body);
        callback(null, result.choices?.[0]?.message?.content || '');
      } catch (e) {
        callback(e);
      }
    });
  });

  req.on('error', callback);
  req.write(data);
  req.end();
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  // API endpoint
  if (urlPath === '/api/grade' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { question, answer } = JSON.parse(body);
        const prompt = `You are an expert Investment Banking interviewer grading technical accounting answers. Using the breaking into wall street guide! 

Question: "${question}"

Student Answer: "${answer}"

Evaluate if the answer demonstrates understanding. Respond with ONLY a JSON object:
{
  "correct": true or false,
  "feedback": "brief explanation",
  "correct_answer": "the key points a correct answer should include",
  "score": a number 1-5 where 5 is perfect
}

Be strict but fair. Focus on accounting accuracy. Include the correct_answer field that shows what a proper answer should cover.`;

        callOpenAI(prompt, (err, result) => {
          if (err) {
            console.error('OpenAI error:', err);
            sendJSON(res, 500, { error: 'Grading failed', message: err.message });
            return;
          }
          
          try {
            // Try to extract JSON from response
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
            sendJSON(res, 200, parsed);
          } catch (e) {
            sendJSON(res, 500, { error: 'Failed to parse AI response', raw: result });
          }
        });
      } catch (e) {
        sendJSON(res, 400, { error: 'Invalid request' });
      }
    });
    return;
  }

  // Static file serving
  let filePath = path.join(ROOT, urlPath);

  // Prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    send(res, 400, 'Bad Request');
    return;
  }

  // Directory -> index.html
  if (urlPath === '/' || fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for unknown routes (SPA-style)
      const fallback = path.join(ROOT, 'index.html');
      fs.readFile(fallback, (e2, d2) => {
        if (e2) return send(res, 404, 'Not Found');
        send(res, 200, d2, MIME['.html']);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    send(res, 200, data, type);
  });
});

server.listen(PORT, () => {
  console.log(`Dev server running on http://localhost:${PORT}`);
});


