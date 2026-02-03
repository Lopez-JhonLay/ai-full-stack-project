import { Button } from './ui/button';

import { FiSend } from 'react-icons/fi';

function ChatBot() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative">
        <textarea
          className="w-full min-h-[120px] p-4 pr-16 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-sm transition-all duration-200 placeholder-gray-400"
          placeholder="Type your message here..."
          rows={4}
          maxLength={1000}
        />
        <Button className="w-10 h-10 absolute bottom-3 right-3 px-4 py-2 text-white rounded-full transition-colors duration-200 shadow-sm cursor-pointer">
          <FiSend />
        </Button>
      </div>
    </div>
  );
}

export default ChatBot;
