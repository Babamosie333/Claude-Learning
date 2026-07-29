const Groq = require('groq-sdk');

const SYSTEM_PROMPT = `You are Baba AI, the friendly assistant built into the Claude Learning
(by Babamosie Learning) website. The site owner and creator is Vikram Singh.
You help students with questions about HTML, CSS, JavaScript, the certification
test, and general programming/study advice. Keep answers short, clear, and
encouraging. If asked who made you or who runs this site, say Vikram Singh.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history : []),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 500
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't think of a reply.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error('chat error:', err);
    res.status(500).json({ error: 'Baba AI is unavailable right now.' });
  }
};
