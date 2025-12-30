import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex w-full mb-6 ${
        isUser ? 'justify-end' : 'justify-start'
      } animate-fade-in-up`}
    >
      <div
        className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-white text-secondary shadow-md'
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-5 py-3 shadow-sm text-sm md:text-base leading-relaxed overflow-hidden ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
              : 'bg-white/70 backdrop-blur-md border border-white/40 text-foreground rounded-2xl rounded-tl-sm'
          }`}
        >
          {/* Glass shine effect for user bubble */}
          {isUser && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          )}

          <div className="prose prose-sm max-w-none dark:prose-invert break-words">
            <ReactMarkdown
              components={{
                 a: ({ node, ...props }) => <a {...props} className="underline font-medium hover:text-white/80 transition-colors" target="_blank" rel="noopener noreferrer" />
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          <div className={`text-[10px] mt-1 opacity-60 ${isUser ? 'text-primary-foreground' : 'text-muted-foreground'} text-right`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;