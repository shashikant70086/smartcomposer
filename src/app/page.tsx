"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NotificationComposerCard from '@/components/NotificationComposerCard';
import ThemeToggle from '@/components/theme-toggle';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useTheme } from '@/hooks/use-theme';
import PreviewCard from '@/components/PreviewCard';

type NotificationTone = 'casual' | 'friendly' | 'formal' | 'urgent';
type NotificationChannel = 'Email' | 'SMS' | 'Push';

export default function SmartComposerPage() {
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<NotificationTone | null>(null);
  const [channel, setChannel] = useState<NotificationChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Save presets to localStorage whenever they change
  // useEffect(() => {
  //   localStorage.setItem('smartComposerPresets', JSON.stringify(presets));
  // }, [presets]);

  const [messages, setMessages] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setMessages([]); // Clear previous messages
    try {
      // Replace with your actual Genkit flow invocation
      // This is a placeholder using fetch, adjust based on your genkit setup
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, tone, channel }),
      });
      const data = await response.json();
      setMessages(data.variants || []); // Assuming the API returns { variants: string[] }
    } catch (error) {
      console.error('Error generating notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 md:p-8 ${theme === 'dark' ? 'dark' : ''} bg-background text-foreground selection:bg-primary/20 selection:text-primary`}>
      <header className="w-full max-w-4xl mb-8 flex justify-end items-center">
        <ThemeToggle />
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <NotificationComposer
          prompt={prompt}
          setPrompt={setPrompt}
          tone={tone}
          setTone={setTone}
          channel={channel}
          setChannel={setChannel}
          onGenerate={handleGenerate} // Pass the handleGenerate function
          isLoading={isLoading}
        />

        {/* Render Preview Cards in a grid */}
        <AnimatePresence>
          {messages.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            {messages.map((msg, index) => (
              <PreviewCard key={index} message={msg} />
            ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Placeholder for FAB */}
      <FloatingActionButton />
    </div>
  );
}
