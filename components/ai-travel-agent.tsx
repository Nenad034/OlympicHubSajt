'use client';

/**
 * AI Travel Agent Component
 * 
 * Features:
 * - Vercel AI SDK integration
 * - Generative UI - renders React components in chat
 * - Natural language understanding
 * - Context-aware recommendations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  component?: React.ReactNode;
}

// Mock hotel carousel component that AI can render
function HotelCarousel({ hotels }: { hotels: Array<{ name: string; location: string; price: number }> }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Here are hotels with pools:</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {hotels.map((hotel, index) => (
          <Card key={index} className="min-w-[200px]">
            <CardContent className="p-4">
              <p className="font-medium text-sm">{hotel.name}</p>
              <p className="text-xs text-gray-500">{hotel.location}</p>
              <p className="text-sm font-bold mt-2">€{hotel.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AiTravelAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI travel agent. I can help you find the perfect hotel, flight, or complete package. Just tell me what you're looking for!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      let assistantMessage: Message;

      // Simple keyword matching for demo (in production, use actual AI)
      if (input.toLowerCase().includes('pool')) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I found some great hotels with pools for you:',
          component: (
            <HotelCarousel
              hotels={[
                { name: 'Sunset Resort', location: 'Santorini', price: 250 },
                { name: 'Blue Lagoon Hotel', location: 'Crete', price: 180 },
                { name: 'Paradise Beach', location: 'Rhodes', price: 220 },
              ]}
            />
          ),
        };
      } else if (input.toLowerCase().includes('budget') || input.toLowerCase().includes('cheap')) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I understand you're looking for budget-friendly options. Here are some affordable packages I recommend:",
          component: (
            <div className="space-y-2">
              <Card className="p-4">
                <p className="font-medium">Budget Greece Package</p>
                <p className="text-sm text-gray-600">3 nights in Athens + Flight</p>
                <p className="font-bold text-green-600 mt-2">€399</p>
              </Card>
            </div>
          ),
        };
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I can help you with that! Could you tell me more about your preferences? For example, what's your budget range and how many travelers?",
        };
      }

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-0">
        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.component && (
                    <div className="mt-2">{message.component}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask me anything about travel..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Try: &quot;Show me hotels with pools&quot; or &quot;I need a budget package to Greece&quot;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
