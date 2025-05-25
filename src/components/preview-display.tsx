"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import type { NotificationChannel, NotificationTone, ComposerFormData } from '@/types';

interface PreviewDisplayProps {
  variants: string[];
  tone: NotificationTone | null;
  channels: ComposerFormData['channels'] | null;
  onScheduleRequest: (variantContent: string, channel: NotificationChannel) => void;
  isLoading: boolean;
}

const channelIcons: Record<NotificationChannel, React.ElementType> = {
  push: Bell,
  email: Mail,
  sms: MessageSquare,
};

export function PreviewDisplay({ variants, tone, channels, onScheduleRequest, isLoading }: PreviewDisplayProps) {
  if (isLoading) {
    return (
      <Card className="w-full mt-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Notification Previews</CardTitle>
          <CardDescription>Generating AI-powered suggestions...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded w-1/3 mt-3"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!variants || variants.length === 0) {
    return (
      <Card className="w-full mt-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Notification Previews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Generated notifications will appear here. Fill out the form above and click "Generate Notifications".</p>
        </CardContent>
      </Card>
    );
  }

  const activeChannels = channels 
    ? (Object.keys(channels) as NotificationChannel[]).filter(ch => channels[ch]) 
    : [];

  return (
    <Card className="w-full mt-8 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Notification Previews</CardTitle>
        {tone && <CardDescription>Tone: <span className="capitalize font-medium">{tone}</span></CardDescription>}
      </CardHeader>
      <CardContent>
        {activeChannels.length === 0 && variants.length > 0 && (
            <div className="space-y-4">
                {variants.map((variant, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg">Variant {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-28">
                                <p className="text-sm whitespace-pre-wrap">{variant}</p>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter>
                           {/* No specific channel selected, so generic schedule button or no button */}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
        {activeChannels.map(channel => (
          <div key={channel} className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              {React.createElement(channelIcons[channel], { className: "h-6 w-6 text-primary" })}
              <h3 className="text-xl font-medium capitalize">{channel} Previews</h3>
            </div>
            {variants.length > 0 ? (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <Card key={`${channel}-${index}`} className="overflow-hidden border-l-4 border-primary">
                    <CardHeader>
                       <CardTitle className="text-md">Option {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-auto max-h-32">
                        <p className="text-sm whitespace-pre-wrap">{variant}</p>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-4">
                      <Button
                        size="sm"
                        onClick={() => onScheduleRequest(variant, channel)}
                        className="ml-auto"
                      >
                        Schedule for {channel}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No variants generated for this channel.</p>
            )}
            {activeChannels.length > 1 && channel !== activeChannels[activeChannels.length-1] && <Separator className="my-6" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
