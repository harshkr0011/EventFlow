
import type { Event } from '@/lib/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventDetailsContent } from './event-details-content';

type EventDetailsDialogProps = {
  event: Event | null;
  onOpenChange: (open: boolean) => void;
  isBookmarked: boolean;
  toggleBookmark: (eventId: string) => void;
};

export function EventDetailsDialog({ event, onOpenChange, isBookmarked, toggleBookmark }: EventDetailsDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 grid grid-cols-1 md:grid-cols-2 gap-0">
        <ScrollArea className="max-h-[90vh] md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2">
                 <EventDetailsContent 
                    event={event}
                    isBookmarked={isBookmarked}
                    toggleBookmark={toggleBookmark}
                />
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
