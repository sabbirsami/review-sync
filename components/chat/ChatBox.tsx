'use client';

import {
  Bot,
  CheckCircle2,
  Clock,
  Maximize2,
  Minimize2,
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

const ChatBox = () => {
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
  const [isMinimized, setIsMinimized] = useState(false);
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
    <div
      className={`flex sticky top-0 flex-col transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-screen'
      } border-l border-slate-200/50 bg-gradient-to-b from-white via-slate-50 to-blue-50 shadow-2xl shadow-blue-500/5`}
    >
      {/* Enhanced Chat Header */}
      <div className="border-b border-slate-200/50 p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AI Assistant
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Online & Ready</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
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
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
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
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md'
                        : message.type === 'analysis'
                        ? 'bg-gradient-to-r from-emerald-50 to-blue-50 text-slate-800 border border-emerald-200/50 rounded-bl-md'
                        : 'bg-white text-slate-800 border border-slate-200/50 rounded-bl-md'
                    }`}
                  >
                    {message.type === 'analysis' && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600 mb-2">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Analysis</span>
                      </div>
                    )}

                    <p className="leading-relaxed">{message.text}</p>

                    <div
                      className={`flex items-center gap-1 mt-2 text-xs ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200/50 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-slate-600 mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                <span>Quick actions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-full transition-all duration-200 hover:shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input Area */}
          <div className="border-t border-slate-200/50 p-4 bg-white/80 backdrop-blur-sm">
            <div className="relative">
              <div className="flex items-end gap-3 bg-white rounded-2xl border border-slate-200/50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about reviews, analytics, or get AI suggestions..."
                  className="flex-1 p-4 bg-transparent border-none focus:outline-none resize-none text-sm placeholder-slate-400 min-h-[44px] max-h-32"
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
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                    title="Attach file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Character count for long messages */}
              {inputValue.length > 200 && (
                <div className="text-xs text-slate-500 mt-1 text-right">
                  {inputValue.length}/500
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
    </div>
  );
};

export default ChatBox;
