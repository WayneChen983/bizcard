
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { Bot, ChevronLeft, Send, Loader2, User, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Contact } from '@/lib/types';
import { businessMatchmaker, BusinessMatchmakerOutput } from '@/ai/flows/business-matchmaker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string | BusinessMatchmakerOutput;
}

const AiAssistantPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { firestore } = useFirebase();
  const { user } = useUser();

  const contactsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'contacts');
  }, [firestore, user]);
  const { data: contacts = [] } = useCollection<Contact>(contactsQuery);

  const handleQuery = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: query }]);

    try {
      const result = await businessMatchmaker({ userNeed: query, contacts });
      setMessages(prev => [...prev, { role: 'assistant', content: result }]);
    } catch (error) {
      console.error("Error calling businessMatchmaker flow:", error);
      const errorMessage = {
        analysis: "Error",
        recommendations: [],
        suggestions: "Sorry, I encountered an error trying to process your request. Please try again."
      };
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setQuery('');
      setIsLoading(false);
    }
  };

  const renderAssistantMessage = (content: BusinessMatchmakerOutput) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2 text-primary">【{t('ai_assistant_analysis_title')}】</h3>
        <p className="whitespace-pre-wrap">{content.analysis}</p>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 text-primary">【{t('ai_assistant_recommendations_title')}】</h3>
        {content.recommendations.length > 0 ? (
          <div className="space-y-4">
            {content.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{rec.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{rec.company} - {rec.jobTitle}</p>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-base mb-2">{t('ai_assistant_reason_title')}</p>
                  <p className="whitespace-pre-wrap">{rec.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>{t('ai_assistant_no_recommendations')}</p>
        )}
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2 text-primary">【{t('ai_assistant_suggestions_title')}】</h3>
        <p className="whitespace-pre-wrap">{content.suggestions}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('nav_ai_assistant')}
        </h1>
        <div className="w-10"></div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-16">
              <Sparkles className="w-16 h-16 mb-4" />
              <h2 className="text-xl font-bold text-foreground">{t('ai_assistant_welcome_title')}</h2>
              <p className="max-w-md">{t('ai_assistant_welcome_desc')}</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </Avatar>
              )}
              <div className={`rounded-lg p-4 max-w-[85%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {typeof message.content === 'string' ? <p>{message.content}</p> : renderAssistantMessage(message.content)}
              </div>
              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                    <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isLoading && messages[messages.length-1]?.role === 'user' && (
              <div className="flex items-start gap-4">
                  <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </Avatar>
                  <div className="rounded-lg p-4 bg-muted flex items-center">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground"/>
                  </div>
              </div>
            )}
        </div>
      </ScrollArea>

      <footer className="sticky bottom-0 z-10 border-t bg-background p-4">
        <div className="relative">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQuery()}
            placeholder={t('ai_assistant_placeholder')}
            className="pr-12"
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleQuery}
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default AiAssistantPage;
