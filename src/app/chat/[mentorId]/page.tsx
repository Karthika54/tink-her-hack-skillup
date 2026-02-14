'use client';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, CheckCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatPage() {
  const params = useParams();
  const {
    mentors,
    user,
    getChatHistory,
    sendMessage,
    getActiveSession,
    completeSession,
  } = useAppContext();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const mentorId = typeof params.mentorId === 'string' ? params.mentorId : '';
  const mentor = mentors.find((m) => m.id === mentorId);
  const chatHistory = getChatHistory(mentorId);
  const activeSession = getActiveSession(mentorId);

  const mentorImage = mentor
    ? PlaceHolderImages.find((p) => p.id === mentor.image)
    : undefined;

  const userImagePlaceholder = user
    ? PlaceHolderImages.find((p) => p.id === user.image)
    : undefined;
  const userImageUrl = userImagePlaceholder?.imageUrl;

  useEffect(() => {
    if (scrollAreaRef.current) {
      // A bit of a hack to get the viewport element. The component library doesn't expose it.
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chatHistory, isSending]);

  if (!mentor || !user) {
    return <div>Loading chat...</div>;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isSending) {
      const messageText = newMessage;
      setNewMessage('');
      setIsSending(true);
      await sendMessage(mentorId, { text: messageText, sender: 'user' });
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-3xl mx-auto bg-card border rounded-xl">
      <header className="flex items-center justify-between gap-4 p-4 border-b">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={mentorImage?.imageUrl} alt={mentor.name} />
            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">
                Chat with {mentor.name}'s AI Assistant
              </h2>
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
        {activeSession && (
          <Button onClick={() => completeSession(activeSession.id)}>
            <CheckCircle className="mr-2" />
            Mark as Complete
          </Button>
        )}
      </header>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex items-end gap-3',
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.sender === 'mentor' && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={mentorImage?.imageUrl} />
                  <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md p-3 rounded-2xl',
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                )}
              >
                <p>{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={userImageUrl} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isSending && (
            <div className="flex items-end gap-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarImage src={mentorImage?.imageUrl} />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="p-3 rounded-2xl bg-secondary rounded-bl-none">
                <div className="flex items-center justify-center gap-1">
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t flex items-center gap-2"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question..."
          autoComplete="off"
          disabled={isSending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newMessage.trim() || isSending}
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
