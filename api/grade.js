const https = require('https');

function callOpenAI(prompt) {
  return new Promise((resolve, reject) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      reject(new Error('OpenAI API key not configured'));
      return;
    }

    const data = JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
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
          resolve(result.choices?.[0]?.message?.content || '');
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { question, answer } = req.body;
    
    if (!question || !answer) {
      res.status(400).json({ error: 'Missing question or answer' });
      return;
    }

    const prompt = `You are an expert Investment Banking interviewer grading technical accounting answers.

Question: "${question}"

Student Answer: "${answer}"

Respond with ONLY this JSON format:
{
  "correct": true or false,
  "feedback": "brief explanation",
  "correct_answer": "key points a correct answer should include",
  "score": a number from 1-5 where 5 is perfect
}

Be strict but fair. Focus on accounting accuracy.`;

    const result = await callOpenAI(prompt);
    
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
      res.status(200).json(parsed);
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse AI response', raw: result });
    }
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Grading failed', message: err.message });
  }
};

