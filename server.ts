import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { co2PerKgBiochar, feedstocks, how, HYACINTH_WATER, kiln, PERMANENCE } from './src/content';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50kb' }));

function isValidApiKey(key: string | undefined): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed !== '' && trimmed !== 'MY_GEMINI_API_KEY' && trimmed.length >= 10;
}

/**
 * The assistant only knows the facts the site publishes. They are read from
 * src/content.ts, so the site and the assistant can never disagree.
 */
function factSheet(): string {
  const rows = feedstocks
    .map(
      (f) =>
        `- ${f.label.en}: about ${Math.round(f.yield * 100)} kg biochar per 100 kg dry leftovers; ` +
        `about ${co2PerKgBiochar(f.carbon).toFixed(2)} kg CO2 stored per kg biochar` +
        (f.assumption ? ' (our own estimate, not yet lab tested)' : ''),
    )
    .join('\n');
  const specs = kiln.specs.map((s) => `- ${s.label.en}: ${s.value.en}`).join('\n');
  const steps = how.steps.map((s, i) => `${i + 1}. ${s.title.en}: ${s.body.en}`).join('\n');
  const safety = how.safety.items.map((s) => `- ${s.en}`).join('\n');

  return `FEEDSTOCK FIGURES (use only these; always give results as rough ranges of about ±30%):
${rows}
Formula: CO2 = biochar kg × carbon share × ${PERMANENCE} × 44/12 (IPCC 2019 defaults, kilns at 450–600 °C).
Fresh water hyacinth is about ${Math.round(HYACINTH_WATER * 100)}% water, so remove the water before using these figures.

OUR KILN (design figures, being measured in the field):
${specs}

HOW WE MAKE BIOCHAR:
${steps}

SAFETY:
${safety}`;
}

function systemInstruction(language: string): string {
  const langLine =
    language === 'sw'
      ? 'Reply in clear, everyday Kenyan Kiswahili that a smallholder farmer would use. Keep technical words simple.'
      : 'Reply in plain, friendly English.';
  return `You answer questions for Green Carbon Valley, a small team in Kenya that helps smallholder farmers turn crop leftovers and water hyacinth into biochar.

${langLine}

How to answer:
- Be short and practical: a few sentences or a short list. No headings, no emoji.
- Use ONLY the figures in the fact sheet below for yields, carbon and kiln specifications. Never invent numbers, results, farmer names, prices or certifications.
- If you don't know, or the question needs someone to look at their farm, say so and suggest messaging the team on WhatsApp.
- Do not promise income from carbon credits. The project makes no carbon-income claims today.
- For safety questions, put safety first and suggest talking to the team.
- You are an AI assistant; never claim to be a person or an agronomist.

${factSheet()}`;
}

type Turn = { role: string; content: string };

app.post('/api/chat', async (req, res) => {
  const { message, history, language = 'en' } = req.body ?? {};
  if (!message || typeof message !== 'string' || message.length > 1000) {
    return res.status(400).json({ error: 'A question of up to 1,000 characters is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!isValidApiKey(apiKey)) {
    // No canned answers: the page tells the visitor to use WhatsApp instead.
    return res.status(503).json({ error: 'Assistant not configured.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey! });
    const turns: Turn[] = Array.isArray(history) ? history.slice(-10) : [];
    const contents = [
      ...turns
        .filter((t) => t && typeof t.content === 'string')
        .map((t) => ({ role: t.role === 'user' ? 'user' : 'model', parts: [{ text: t.content.slice(0, 2000) }] })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: { systemInstruction: systemInstruction(language === 'sw' ? 'sw' : 'en') },
    });

    const text = response.text ?? '';
    if (!text) return res.status(502).json({ error: 'Empty answer.' });
    return res.json({ text });
  } catch (err: any) {
    console.warn('Gemini call failed:', err?.message || err);
    return res.status(502).json({ error: 'Assistant unavailable.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Green Carbon Valley server listening on port ${PORT}`);
  });
}

startServer();
