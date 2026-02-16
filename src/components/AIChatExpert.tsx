import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Trek, QuizAnswers } from '../types/quiz';

interface AIChatExpertProps {
  matches: Trek[];
  answers: QuizAnswers;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatExpert: React.FC<AIChatExpertProps> = ({ matches, answers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Namaste! I'm your Nepal trekking expert. I see ${matches[0]?.name} is your top match. How can I help you plan your adventure?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const systemPrompt = `You are a Nepal trekking expert. Answer questions about the recommended treks using ONLY the provided context. Be concise, practical, and safety-focused. Mention altitude risks if relevant. Suggest specific teahouses or villages when asked about accommodations.
      
      Recommended Treks Context:
      ${matches.map((m, i) => `#${i+1} ${m.name}: ${m.description}. Highlights: ${m.highlights.join(', ')}. Season: ${m.best_season}. Cost: $${m.estimated_cost_usd}`).join('\n')}
      
      User's Quiz Profile:
      - Days: ${answers.days}
      - Priority: ${answers.priority}
      - Budget: ${answers.budget}
      - Fitness: ${answers.fitness}
      - Style: ${answers.style}`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) throw new Error('Groq API failed');

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Groq Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Expert temporarily unavailable. Please try again later or reach out to our team at assistance@discovernepal.com." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[380px] sm:w-[420px] max-h-[600px] flex flex-col"
          >
            <Card className="rounded-3xl shadow-2xl border-border/50 flex flex-col overflow-hidden h-full bg-card">
              {/* Header */}
              <div className="p-6 bg-primary text-primary-foreground flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold leading-none">Trek Expert</h4>
                    <span className="text-xs text-primary-foreground/70">Powered by AI</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/10 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/30 min-h-[300px] max-h-[400px]">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                      max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed transition-colors
                      ${m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-card border border-border/50 text-foreground shadow-sm rounded-bl-none'}
                    `}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border/50 p-4 rounded-2xl rounded-bl-none flex gap-1 items-center">
                      <div className="w-1 h-1 bg-muted-foreground/30 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer Input */}
              <div className="p-4 bg-card border-t border-border/50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about your trek..."
                    className="flex-1 bg-muted/50 border-border/50 rounded-xl focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  />
                  <Button type="submit" size="icon" disabled={isTyping || !message.trim()} className="rounded-xl shadow-lg">
                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 p-4 rounded-full shadow-2xl transition-all duration-300
          ${isOpen ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}
        `}
      >
        <MessageSquare className="w-6 h-6" />
        {!isOpen && <span className="font-bold pr-2">Ask AI Expert</span>}
        {isOpen && <X className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
