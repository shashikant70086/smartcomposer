"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NotificationComposerCard from '@/components/NotificationComposerCard';
import { ThemeToggle } from '@/components/theme-toggle';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useTheme } from '@/hooks/use-theme';
import PreviewCard from '@/components/PreviewCard';
import { NotificationComposer } from '@/components/notification-composer';
import { PreviewDisplay } from '@/components/preview-display';
import { SchedulerModal } from '@/components/scheduler-modal';
import type { ComposerFormData, Preset, NotificationChannel, NotificationTone } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';


export default function SmartComposerPage() {
  const { theme } = useTheme(); // Changed from useThemeContext to useTheme
  const { toast } = useToast();

  // State for NotificationComposer
  const [composerData, setComposerData] = useState<ComposerFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for PreviewDisplay
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
  const [activeTone, setActiveTone] = useState<NotificationTone | null>(null);
  const [activeChannels, setActiveChannels] = useState<ComposerFormData['channels'] | null>(null);

  // State for SchedulerModal
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [schedulingContent, setSchedulingContent] = useState<string | null>(null);
  const [schedulingChannel, setSchedulingChannel] = useState<NotificationChannel | null>(null);

  // State for Presets
  const [presets, setPresets] = useState<Preset[]>([]);
  
  // Load presets from localStorage on initial render
  useEffect(() => {
    const storedPresets = localStorage.getItem('smartComposerPresets');
    if (storedPresets) {
      setPresets(JSON.parse(storedPresets));
    }
  }, []);

  // Save presets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('smartComposerPresets', JSON.stringify(presets));
  }, [presets]);


  const handleGenerateNotifications = (
    variants: string[],
    tone: NotificationTone,
    channels: ComposerFormData['channels']
  ) => {
    setGeneratedVariants(variants);
    setActiveTone(tone);
    setActiveChannels(channels);
  };

  const handleSavePreset = (name: string, data: ComposerFormData) => {
    const newPreset: Preset = { ...data, id: Date.now().toString(), name };
    setPresets(prev => [...prev, newPreset]);
  };

  const handleLoadPreset = (presetId: string) => {
    const presetToLoad = presets.find(p => p.id === presetId);
    if (presetToLoad) {
      // Form values will be reset by NotificationComposer component itself
      // We can update activeTone and activeChannels if needed for other parts of the UI
      setActiveTone(presetToLoad.tone);
      setActiveChannels(presetToLoad.channels);
      // Potentially clear generated variants when a preset is loaded
      setGeneratedVariants([]);
    }
  };

  const handleScheduleRequest = (variantContent: string, channel: NotificationChannel) => {
    setSchedulingContent(variantContent);
    setSchedulingChannel(channel);
    setIsSchedulerOpen(true);
  };

  const handleConfirmSchedule = (dateTime: Date, content: string, channel: NotificationChannel) => {
    console.log(`Scheduled: ${content} for ${channel} at ${format(dateTime, "PPP p")}`);
    toast({
      title: "Notification Scheduled!",
      description: `Your ${channel} notification has been scheduled for ${format(dateTime, "MMM d, yyyy 'at' h:mm a")}. (Simulated)`,
    });
    // Reset for next scheduling
    setSchedulingContent(null);
    setSchedulingChannel(null);
  };

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 md:p-8 bg-background text-foreground selection:bg-primary/20 selection:text-primary`}>
      <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          SmartCompose AI
        </h1>
        <ThemeToggle />
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <NotificationComposer
          onGenerate={handleGenerateNotifications}
          onSavePreset={handleSavePreset}
          presets={presets}
          onLoadPreset={handleLoadPreset}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <PreviewDisplay
          variants={generatedVariants}
          tone={activeTone}
          channels={activeChannels}
          onScheduleRequest={handleScheduleRequest}
          isLoading={isLoading}
        />
      </main>

      <SchedulerModal
        isOpen={isSchedulerOpen}
        onOpenChange={setIsSchedulerOpen}
        notificationContent={schedulingContent}
        notificationChannel={schedulingChannel}
        onConfirmSchedule={handleConfirmSchedule}
      />
      
      {/* FloatingActionButton can be used for other actions like quick summary or new composition */}
      {/* <FloatingActionButton /> */}
    </div>
  );
}
