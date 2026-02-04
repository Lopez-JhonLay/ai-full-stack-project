import ConversationRepository from '../repositories/conversation.repository';

import OpenAI from 'openai';

const conversationRepository = new ConversationRepository();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

type ChatResponse = {
  id: string;
  message: string;
};

class ChatService {
  async sendMessage(prompt: string, conversationId: string): Promise<ChatResponse> {
    const history = conversationRepository.getMessages(conversationId);

    const messages = [...history, { role: 'user' as const, content: prompt }];

    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: messages,
      temperature: 0.2,
      max_output_tokens: 500,
    });

    const assistantMessage: string = response.output_text;

    // Save both user and assistant messages to repository
    conversationRepository.addMessage(conversationId, { role: 'user', content: prompt });
    conversationRepository.addMessage(conversationId, { role: 'assistant', content: assistantMessage });

    return {
      id: response.id,
      message: response.output_text,
    };
  }
}

export default ChatService;
