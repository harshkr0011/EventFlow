'use client';

import type { Event } from '@/lib/types';
import {
  Drawer,
  DrawerContent,
} from '@/components/ui/drawer';
import { EventDetailsContent } from './event-details-content';
import { ScrollArea } from './ui/scroll-area';

type EventDetailsDrawerProps = {
  event: Event | null;
  onOpenChange: (open: boolean) => void;
  isBookmarked: boolean;
  toggleBookmark: (eventId: string) => void;
};

export function EventDetailsDrawer({ event, onOpenChange, isBookmarked, toggleBookmark }: EventDetailsDrawerProps) {
    if (!event) return null;

    return (
        <Drawer open={!!event} onOpenChange={onOpenChange}>
            <DrawerContent>
                <ScrollArea className="h-[85vh]">
                    <EventDetailsContent
                        event={event}
                        isBookmarked={isBookmarked}
                        toggleBookmark={toggleBookmark}
                    />
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
