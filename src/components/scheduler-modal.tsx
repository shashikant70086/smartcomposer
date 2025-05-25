"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, setHours, setMinutes, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import type { NotificationChannel } from '@/types';

interface SchedulerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notificationContent: string | null;
  notificationChannel: NotificationChannel | null;
  onConfirmSchedule: (dateTime: Date, content: string, channel: NotificationChannel) => void;
}

export function SchedulerModal({
  isOpen,
  onOpenChange,
  notificationContent,
  notificationChannel,
  onConfirmSchedule,
}: SchedulerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>(format(new Date(), "HH:mm")); // Default to current time in HH:mm format

  // Effect to reset state when modal opens with new content, or closes
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(new Date());
      setSelectedTime(format(new Date(), "HH:mm"));
    }
  }, [isOpen, notificationContent, notificationChannel]);


  const handleConfirm = () => {
    if (!selectedDate || !notificationContent || !notificationChannel) return;

    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        // Handle invalid time format, perhaps show a toast
        console.error("Invalid time format");
        return;
      }
      
      let dateTime = setHours(selectedDate, hours);
      dateTime = setMinutes(dateTime, minutes);
      
      onConfirmSchedule(dateTime, notificationContent, notificationChannel);
      onOpenChange(false);
    } catch (error) {
      console.error("Error parsing date/time:", error);
      // Handle error, e.g., show a toast
    }
  };

  if (!notificationContent || !notificationChannel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Schedule Notification</DialogTitle>
          <DialogDescription>
            Select a date and time to send this <span className="font-semibold capitalize">{notificationChannel}</span> notification.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="p-3 border rounded-md bg-secondary/50">
            <p className="text-sm text-secondary-foreground font-medium mb-1">Preview:</p>
            <p className="text-sm text-muted-foreground max-h-20 overflow-y-auto">{notificationContent}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="schedule-date" className="text-base">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-base h-11",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // Disable past dates
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="schedule-time" className="text-base">Time (24-hour)</Label>
              <Input
                id="schedule-time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="text-base h-11"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-base">Cancel</Button>
          <Button onClick={handleConfirm} className="text-base">Confirm Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
