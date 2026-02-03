import express from 'express';
import type { Request, Response } from 'express';

import dotenv from 'dotenv';

import OpenAI from 'openai';

import z from 'zod';

import { ConversationRepository } from './repositories/conversation.repository';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize the conversation repository
const conversationRepository = new ConversationRepository();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

const chatSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required.').max(1000, 'Prompt is too long (max 1000 characters'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parsedResult = chatSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json(z.treeifyError(parsedResult.error));
    return;
  }

  const { prompt, conversationId } = parsedResult.data;

  // Get conversation history from repository
  const history = conversationRepository.getMessages(conversationId);

  const messages = [...history, { role: 'user' as const, content: prompt }];

  try {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: messages,
      temperature: 0.2,
      max_output_tokens: 100,
    });

    const assistantMessage: string = response.output_text;

    // Save both user and assistant messages to repository
    conversationRepository.addMessage(conversationId, { role: 'user', content: prompt });
    conversationRepository.addMessage(conversationId, { role: 'assistant', content: assistantMessage });

    res.json({ message: response.output_text });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate a response.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
