'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Bot,
  CheckCircle2,
  Clock,
  MessageCircle,
  Paperclip,
  Send,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'analysis';
  isTyping?: boolean;
}

const ChatSheet = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Review Assistant. I can help you analyze reviews, generate responses, and provide insights about your customer feedback. What would you like to explore today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickSuggestions = [
    '📊 Show review analytics',
    '✨ Generate reply suggestions',
    '🔍 Find negative reviews',
    '📈 Response rate insights',
  ];

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response with realistic delay
    setTimeout(() => {
      const responses = [
        'I can help analyze your review data. Based on your recent reviews, I notice you have 12 pending responses. Would you like me to generate some reply suggestions?',
        'Great question! Looking at your analytics, your average response time is 2.3 hours, which is excellent. Your customers appreciate quick responses. Would you like to see sentiment analysis for recent reviews?',
        'I found 3 reviews that might need attention. Let me break down the sentiment analysis and suggest personalized responses for each one.',
        "Your review trends show a 15% increase in positive feedback this month! The keywords customers mention most are 'helpful staff' and 'quick service'. Want me to dive deeper?",
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date(),
        type: 'analysis',
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion.substring(2)); // Remove emoji
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-foreground hover:from-foreground hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          size="icon"
        >
          <MessageCircle className="h-10 w-10 text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-[500px] p-0 flex flex-col">
        <SheetHeader className="border-b border-[#D1D9D8] p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-foreground rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <SheetTitle className="font-semibold text-lg text-foreground">
                  AI Review Assistant
                </SheetTitle>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>Online & Ready</span>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F4E9]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              } animate-fadeIn`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-primary to-foreground'
                      : 'bg-gradient-to-br from-primary to-foreground'
                  } shadow-lg`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-primary to-foreground text-white rounded-br-md'
                      : message.type === 'analysis'
                      ? 'bg-gradient-to-r from-[#F0EDE0] to-white text-foreground border border-[#D1D9D8] rounded-bl-md'
                      : 'bg-white text-foreground border border-[#D1D9D8] rounded-bl-md'
                  }`}
                >
                  {message.type === 'analysis' && (
                    <div className="flex items-center gap-1 text-xs text-primary mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Analysis</span>
                    </div>
                  )}
                  <p className="leading-relaxed">{message.text}</p>
                  <div
                    className={`flex items-center gap-1 mt-2 text-xs ${
                      message.sender === 'user' ? 'text-[#A8D5D1]' : 'text-foreground/70'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.sender === 'user' && <CheckCircle2 className="w-3 h-3 ml-1" />}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-foreground rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-[#D1D9D8] px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-xs text-foreground/70 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 bg-[#F7F4E9]">
            <div className="text-xs text-foreground/70 mb-2 flex items-center gap-2">
              <Zap className="w-3 h-3 text-[#FBD686]" />
              <span>Quick actions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-xs bg-white hover:bg-primary/10 border border-[#D1D9D8] hover:border-primary rounded-full transition-all duration-200 hover:shadow-sm text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-[#D1D9D8] p-4 bg-white">
          <div className="relative">
            <div className="flex items-end gap-3 bg-white rounded-2xl border border-[#D1D9D8] shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about reviews, analytics, or get AI suggestions..."
                className="flex-1 p-4 bg-transparent border-none focus:outline-none resize-none text-sm placeholder-foreground/60 min-h-[44px] max-h-32 text-foreground"
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '44px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
              <div className="flex items-center gap-2 p-2">
                <button
                  className="p-2 text-foreground/60 hover:text-foreground hover:bg-[#F0EDE0] rounded-lg transition-all"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-gradient-to-r from-primary to-foreground hover:from-foreground hover:to-primary disabled:from-[#D1D9D8] disabled:to-[#D1D9D8] text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Character count for long messages */}
            {inputValue.length > 200 && (
              <div className="text-xs text-foreground/60 mt-1 text-right">
                {inputValue.length}/500
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
