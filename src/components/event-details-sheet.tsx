
'use client';

import type { Event } from '@/lib/types';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { EventDetailsContent } from './event-details-content';
import { ScrollArea } from './ui/scroll-area';

type EventDetailsSheetProps = {
  event: Event | null;
  onOpenChange: (open: boolean) => void;
  isBookmarked: boolean;
  toggleBookmark: (eventId: string) => void;
};

export function EventDetailsSheet({ event, onOpenChange, isBookmarked, toggleBookmark }: EventDetailsSheetProps) {
    if (!event) return null;

    return (
        <Sheet open={!!event} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="w-full h-[90vh] p-0">
                <ScrollArea className="h-full">
                    <EventDetailsContent
                        event={event}
                        isBookmarked={isBookmarked}
                        toggleBookmark={toggleBookmark}
                    />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
