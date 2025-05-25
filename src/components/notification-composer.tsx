"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Save, ListPlus } from 'lucide-react';
import type { ComposerFormData, Preset, NotificationTone } from '@/types';
import { notificationTones } from '@/types';
import { generateNotificationVariants, type GenerateNotificationVariantsInput } from '@/ai/flows/generate-notification-variants';
import { useToast } from '@/hooks/use-toast';


const composerFormSchema = z.object({
  baseMessage: z.string().min(10, "Base message must be at least 10 characters long."),
  tone: z.enum(notificationTones, { required_error: "Please select a tone." }),
  channels: z.object({
    push: z.boolean().optional(),
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
  }).refine(data => data.push || data.email || data.sms, {
    message: "At least one channel must be selected.",
    path: ["channels"],
  }),
});

interface NotificationComposerProps {
  onGenerate: (variants: string[], tone: NotificationTone, channels: ComposerFormData['channels']) => void;
  onSavePreset: (name: string, data: ComposerFormData) => void;
  presets: Preset[];
  onLoadPreset: (presetId: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function NotificationComposer({
  onGenerate,
  onSavePreset,
  presets,
  onLoadPreset,
  isLoading,
  setIsLoading,
}: NotificationComposerProps) {
  const { toast } = useToast();
  const [presetName, setPresetName] = useState('');
  const [isSavePresetPopoverOpen, setIsSavePresetPopoverOpen] = useState(false);

  const form = useForm<ComposerFormData>({
    resolver: zodResolver(composerFormSchema),
    defaultValues: {
      baseMessage: "",
      tone: "formal",
      channels: { push: true, email: false, sms: false },
    },
  });

  const { control, handleSubmit, reset, watch, formState: { errors } } = form;
  const currentChannels = watch("channels");

  const onSubmit = async (data: ComposerFormData) => {
    setIsLoading(true);
    try {
      const aiInput: GenerateNotificationVariantsInput = {
        baseMessage: data.baseMessage,
        tone: data.tone,
      };
      // Note: The current AI flow `generateNotificationVariants` doesn't use channels directly for generation.
      // We pass channels to `onGenerate` for potential use in `PreviewDisplay` or further processing.
      const result = await generateNotificationVariants(aiInput);
      if (result && result.variants) {
        onGenerate(result.variants, data.tone, data.channels);
        toast({ title: "Notifications Generated", description: "Previews are ready below." });
      } else {
        throw new Error("AI did not return variants.");
      }
    } catch (error) {
      console.error("Error generating notifications:", error);
      toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate notifications. Please try again." });
      onGenerate([], data.tone, data.channels); // Clear previous variants on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({ variant: "destructive", title: "Preset Name Required", description: "Please enter a name for your preset." });
      return;
    }
    const currentData = form.getValues();
    onSavePreset(presetName, currentData);
    setPresetName('');
    setIsSavePresetPopoverOpen(false);
    toast({ title: "Preset Saved", description: `Preset "${presetName}" has been saved.` });
  };

  const handleLoadPreset = (presetId: string) => {
    const presetToLoad = presets.find(p => p.id === presetId);
    if (presetToLoad) {
      reset(presetToLoad); // react-hook-form's reset function updates the form
      onLoadPreset(presetId); // Propagate event if parent needs to know
      toast({ title: "Preset Loaded", description: `Preset "${presetToLoad.name}" has been loaded.` });
    }
  };
  
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Compose Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="baseMessage" className="text-lg">Base Message</Label>
            <Textarea
              id="baseMessage"
              {...form.register("baseMessage")}
              placeholder="Enter the core content of your notification..."
              className="min-h-[120px] text-base"
              aria-invalid={errors.baseMessage ? "true" : "false"}
            />
            {errors.baseMessage && <p className="text-sm text-destructive">{errors.baseMessage.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Tone</Label>
            <Controller
              name="tone"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  {notificationTones.map(tone => (
                    <div key={tone} className="flex items-center space-x-2">
                      <RadioGroupItem value={tone} id={`tone-${tone}`} />
                      <Label htmlFor={`tone-${tone}`} className="capitalize font-normal text-base">{tone}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.tone && <p className="text-sm text-destructive">{errors.tone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Channels</Label>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {(['push', 'email', 'sms'] as const).map(channel => (
                <div key={channel} className="flex items-center space-x-2">
                  <Controller
                    name={`channels.${channel}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`channel-${channel}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={`channel-${channel}`} className="capitalize font-normal text-base">{channel}</Label>
                </div>
              ))}
            </div>
             {errors.channels && <p className="text-sm text-destructive">{errors.channels.message}</p>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="submit" className="flex-1 text-lg py-6" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Generate Notifications
            </Button>

            <Popover open={isSavePresetPopoverOpen} onOpenChange={setIsSavePresetPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 text-lg py-6" type="button">
                  <Save className="mr-2 h-5 w-5" /> Save as Preset
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Save Preset</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter a name for your new preset.
                    </p>
                  </div>
                  <Input
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="e.g., Weekly Update"
                  />
                  <Button onClick={handleSavePreset}>Save</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {presets.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="loadPreset" className="text-lg">Load Preset</Label>
              <Controller
                name="baseMessage" // This controller isn't directly for a form field, but to use Select with RHF context
                control={control}
                render={() => ( // field not used here, direct interaction with Select
                    <Select onValueChange={handleLoadPreset}>
                        <SelectTrigger id="loadPreset" className="text-base">
                        <SelectValue placeholder="Select a preset to load" />
                        </SelectTrigger>
                        <SelectContent>
                        {presets.map(preset => (
                            <SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                )}
                />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
