"use client";

import React, { useState, useEffect } from 'react';
import { NotificationComposer } from '@/components/notification-composer';
import { PreviewDisplay } from '@/components/preview-display';
import { SchedulerModal } from '@/components/scheduler-modal';
import { ThemeToggle } from '@/components/theme-toggle';
import type { ComposerFormData, Preset, NotificationChannel, NotificationTone } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Sparkles } from 'lucide-react';

export default function SmartComposerPage() {
  const { toast } = useToast();
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
  const [composerTone, setComposerTone] = useState<NotificationTone | null>(null);
  const [composerChannels, setComposerChannels] = useState<ComposerFormData['channels'] | null>(null);
  
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedVariantForScheduling, setSelectedVariantForScheduling] = useState<string | null>(null);
  const [selectedChannelForScheduling, setSelectedChannelForScheduling] = useState<NotificationChannel | null>(null);

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

  const handleGenerateNotifications = (variants: string[], tone: NotificationTone, channels: ComposerFormData['channels']) => {
    setGeneratedVariants(variants);
    setComposerTone(tone);
    setComposerChannels(channels);
  };

  const handleSavePreset = (name: string, data: ComposerFormData) => {
    const newPreset: Preset = { ...data, id: Date.now().toString(), name };
    setPresets(prevPresets => [...prevPresets, newPreset]);
  };

  const handleLoadPreset = (presetId: string) => {
    // The NotificationComposer component handles resetting form values.
    // This function can be used for any additional logic if needed when a preset is loaded.
    console.log("Preset loaded in parent:", presetId);
  };

  const handleScheduleRequest = (variantContent: string, channel: NotificationChannel) => {
    setSelectedVariantForScheduling(variantContent);
    setSelectedChannelForScheduling(channel);
    setIsSchedulerOpen(true);
  };

  const handleConfirmSchedule = (dateTime: Date, content: string, channel: NotificationChannel) => {
    // In a real app, this would interact with a backend to schedule the notification.
    // For now, just show a toast.
    toast({
      title: "Notification Scheduled!",
      description: `Your ${channel} notification "${content.substring(0,30)}..." is scheduled for ${format(dateTime, "PPPp")}.`,
    });
    console.log("Scheduled:", { dateTime, content, channel });
    setIsSchedulerOpen(false);
    setSelectedVariantForScheduling(null);
    setSelectedChannelForScheduling(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 md:p-8 selection:bg-primary/20 selection:text-primary">
      <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-primary">SmartCompose</h1>
        </div>
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
          tone={composerTone}
          channels={composerChannels}
          onScheduleRequest={handleScheduleRequest}
          isLoading={isLoading}
        />
      </main>

      <SchedulerModal
        isOpen={isSchedulerOpen}
        onOpenChange={setIsSchedulerOpen}
        notificationContent={selectedVariantForScheduling}
        notificationChannel={selectedChannelForScheduling}
        onConfirmSchedule={handleConfirmSchedule}
      />
      
      <footer className="w-full max-w-4xl mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} SmartCompose. AI-Powered Notifications.</p>
      </footer>
    </div>
  );
}
