import express from 'express';
import type { Request, Response } from 'express';

import dotenv from 'dotenv';

import OpenAI from 'openai';

import z from 'zod';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

const conversations = new Map<
  string,
  {
    role: 'user' | 'assistant';
    content: string;
  }[]
>();

const chatSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required.').max(1000, 'Prompt is too long (max 1000 characters'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parsedResult = chatSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json(z.treeifyError(parsedResult.error));
  }

  const { prompt, conversationId } = req.body;

  const history = conversations.get(conversationId) ?? [];

  const messages = [...history, { role: 'user' as const, content: prompt }];

  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: messages,
      temperature: 0.2,
      max_output_tokens: 100,
    });

    const assistantMessage: string = response.output_text;

    conversations.set(conversationId, [...messages, { role: 'assistant' as const, content: assistantMessage }]);

    res.json({ message: response.output_text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate a response.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
