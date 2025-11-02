const https = require('https');

function callOpenAI(prompt) {
  return new Promise((resolve, reject) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      reject(new Error('OpenAI API key not configured'));
      return;
    }

    const data = JSON.stringify({
      model: 'gpt-5',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 500
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

Evaluate if the answer demonstrates understanding. Respond with ONLY a JSON object:
{
  "correct": true or false,
  "feedback": "brief explanation",
  "correct_answer": "the key points a correct answer should include",
  "score": a number 1-5 where 5 is perfect
}

Be strict but fair. Focus on accounting accuracy. Include the correct_answer field that shows what a proper answer should cover.`;

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

