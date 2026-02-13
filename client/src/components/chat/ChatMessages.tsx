import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  role: 'user' | 'bot';
  content: string;
};

type Props = {
  messages: Message[];
};

function ChatMessages({ messages }: Props) {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();

    if (!selection) return;

    e.preventDefault();
    e.clipboardData.setData('text/plain', selection);
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message, index) => (
        <div
          key={index}
          onCopy={onCopyMessage}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={`px-3 py-1 max-w-md rounded-xl ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;
