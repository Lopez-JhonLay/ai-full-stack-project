export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationRepository {
  private conversations = new Map<string, Conversation>();

  getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) || null;
  }

  getMessages(conversationId: string): Message[] {
    const conversation = this.conversations.get(conversationId);
    return conversation?.messages || [];
  }

  addMessage(conversationId: string, message: Message): void {
    const existingConversation = this.conversations.get(conversationId);

    if (existingConversation) {
      existingConversation.messages.push(message);
      existingConversation.updatedAt = new Date();
    } else {
      const newConversation: Conversation = {
        id: conversationId,
        messages: [message],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.conversations.set(conversationId, newConversation);
    }
  }

  addMessages(conversationId: string, messages: Message[]): void {
    messages.forEach((message) => this.addMessage(conversationId, message));
  }

  deleteConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  getAllConversations(): Conversation[] {
    return Array.from(this.conversations.values());
  }

  conversationExists(conversationId: string): boolean {
    return this.conversations.has(conversationId);
  }
}
