import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Menu, Circle } from 'lucide-react';
import { Message } from './types';
import { INITIAL_MESSAGE } from './constants';
import { sendMessageToN8n } from './services/chatService';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: INITIAL_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue(''); // Clear input immediately
    
    // Reset textarea height
    if(inputRef.current) {
        inputRef.current.style.height = 'auto';
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendMessageToN8n(userMessageText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to connect to the agent. Please check your connection or try again later.');
      // Remove the user message if it failed? No, keep it so they can copy it.
      // But maybe indicate error. For now, a toast is good.
    } finally {
      setIsLoading(false);
      // Focus back on input for desktop users
      if (window.matchMedia('(min-width: 768px)').matches) {
          inputRef.current?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      // Auto-grow textarea
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden bg-background">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px]" />
      </div>

      {/* Error Toast */}
      {error && <Toast message={error} onClose={() => setError(null)} />}

      {/* Header */}
      <header className="flex-shrink-0 bg-white/60 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-primary to-blue-400 p-2 rounded-lg text-white shadow-lg shadow-primary/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-foreground leading-tight">Oracle Agent</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Online • Procurement & Expenses
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-black/5 rounded-full transition-colors text-muted-foreground">
            <Menu size={24} />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-5xl mx-auto h-full flex flex-col p-4 md:p-8 space-y-6">
            {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <div className="p-4 bg-white/50 rounded-full mb-4">
                    <Sparkles size={48} className="text-primary" />
                </div>
                <p className="text-muted-foreground text-lg">Start a conversation to get help with procurement.</p>
            </div>
            ) : (
                messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))
            )}

            {isLoading && <TypingIndicator />}
            
            <div ref={messagesEndRef} className="h-2" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 bg-white/60 backdrop-blur-xl border-t border-white/20 z-20">
        <div className="max-w-4xl mx-auto p-4 md:p-6 w-full">
            <div className="relative flex items-end gap-2 bg-white border border-white/60 shadow-sm rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
            <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type your request here..."
                rows={1}
                className="flex-1 max-h-32 bg-transparent border-0 focus:ring-0 text-foreground placeholder:text-muted-foreground resize-none py-3 px-2 leading-relaxed text-base"
            />
            <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                inputValue.trim() && !isLoading
                    ? 'bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
            >
                <Send size={20} className={inputValue.trim() && !isLoading ? 'ml-0.5' : ''} />
            </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-[10px] text-muted-foreground">
                    Press <kbd className="font-sans font-semibold">Enter</kbd> to send, <kbd className="font-sans font-semibold">Shift + Enter</kbd> for new line
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;