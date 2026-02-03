import type { Request, Response } from 'express';

import z from 'zod';

import ChatService from '../services/chat.service';

const chatSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required.').max(1000, 'Prompt is too long (max 1000 characters'),
  conversationId: z.uuid(),
});

const chatService = new ChatService();

export const sendChat = async (req: Request, res: Response) => {
  const parsedResult = chatSchema.safeParse(req.body);

  if (!parsedResult.success) {
    res.status(400).json(z.treeifyError(parsedResult.error));
    return;
  }

  try {
    const { prompt, conversationId } = parsedResult.data;
    const response = await chatService.sendMessage(prompt, conversationId);

    res.json({ message: response.message });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate a response.' });
  }
};
