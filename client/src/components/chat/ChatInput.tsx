import type { KeyboardEvent } from 'react';

import { Button } from '../ui/button';
import { FiSend } from 'react-icons/fi';

import { useForm } from 'react-hook-form';

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmit: (data: ChatFormData) => void;
};

function ChatInput({ onSubmit }: Props) {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = handleSubmit((data) => {
    reset({ prompt: '' });
    onSubmit(data);
  });

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} onKeyDown={onKeyDown} className="relative">
      <textarea
        {...register('prompt', { required: true, validate: (data) => data.trim().length > 0 })}
        className="w-full min-h-[120px] p-4 pr-16 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-sm transition-all duration-200 placeholder-gray-400"
        placeholder="Type your message here..."
        rows={4}
        maxLength={1000}
        autoFocus
      />
      <Button
        disabled={!formState.isValid}
        className="w-10 h-10 absolute bottom-3 right-3 px-4 py-2 text-white rounded-full transition-colors duration-200 shadow-sm cursor-pointer"
      >
        <FiSend />
      </Button>
    </form>
  );
}

export default ChatInput;
