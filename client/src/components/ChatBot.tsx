import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { FiSend } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  role: 'user' | 'bot';
  content: string;
};

function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);

    reset();

    const { data } = await axios.post<ChatResponse>('api/chat', {
      prompt,
      conversationId: conversationId.current,
    });

    setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div>
        <div className="flex flex-col gap-3 mb-10">
          {messages.map((message, index) => (
            <p
              key={index}
              className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
            >
              {message.content}
            </p>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={onKeyDown} className="relative">
          <textarea
            {...register('prompt', { required: true, validate: (data) => data.trim().length > 0 })}
            className="w-full min-h-[120px] p-4 pr-16 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-sm transition-all duration-200 placeholder-gray-400"
            placeholder="Type your message here..."
            rows={4}
            maxLength={1000}
          />
          <Button
            disabled={!formState.isValid}
            className="w-10 h-10 absolute bottom-3 right-3 px-4 py-2 text-white rounded-full transition-colors duration-200 shadow-sm cursor-pointer"
          >
            <FiSend />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
