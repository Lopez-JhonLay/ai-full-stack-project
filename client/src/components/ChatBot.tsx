import { Button } from './ui/button';

import { FiSend } from 'react-icons/fi';

import { useForm } from 'react-hook-form';

type FormData = {
  prompt: string;
};

function ChatBot() {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
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
  );
}

export default ChatBot;
