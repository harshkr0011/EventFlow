
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, Send, X, Bot, User } from 'lucide-react';
import { chat } from '@/ai/flows/chatbot-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 1, text: "Hello! I'm the EventFlow assistant. How can I help you find the perfect event today?", sender: 'bot' },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);


  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await chat({ message: input });
      const botMessage: Message = { id: Date.now() + 1, text: result.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        variant: 'destructive',
        title: 'Chatbot Error',
        description: 'Sorry, I encountered a problem. Please try again.',
      });
      const errorMessage: Message = { id: Date.now() + 1, text: "I'm having trouble connecting right now. Please try again in a moment.", sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  React.useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTo({
            top: viewportRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  React.useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  React.useEffect(() => {
    if (isOpen) {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    }
  }, [isOpen]);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 bg-gradient-primary text-primary-foreground"
        onClick={toggleChat}
        aria-label="Open chatbot"
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageSquarePlus className="h-8 w-8" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] z-50 shadow-2xl flex flex-col animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="text-primary" /> EventFlow Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
             <ScrollArea className="h-full" viewportRef={viewportRef}>
                <div className="p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                    key={msg.id}
                    className={cn(
                        'flex items-start gap-3',
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                    >
                    {msg.sender === 'bot' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                    <div
                        className={cn(
                        'rounded-lg px-3 py-2 max-w-[80%] break-word',
                        msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                    >
                        {msg.text}
                    </div>
                    {msg.sender === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start gap-3 justify-start">
                        <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                        <div className="rounded-lg px-3 py-2 bg-muted text-muted-foreground">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about an event..."
                className="flex-grow"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
