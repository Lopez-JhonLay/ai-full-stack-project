import express from 'express';
import type { Request, Response } from 'express';

import dotenv from 'dotenv';

import z from 'zod';

import ChatService from './services/chat.service';

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const chatService = new ChatService();

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

  const response = await chatService.sendMessage(prompt, conversationId);

  try {
    res.json({ message: response.message });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate a response.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
