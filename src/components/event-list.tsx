
import type { Event } from '@/lib/types';
import { EventCard } from './event-card';

type EventListProps = {
  events: Event[];
  onEventClick: (event: Event) => void;
  bookmarkedEvents: Set<string>;
  toggleBookmark: (eventId: string) => void;
  isClient: boolean;
};

export function EventList({ events, onEventClick, bookmarkedEvents, toggleBookmark, isClient }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-96 rounded-lg bg-muted/50">
        <h3 className="text-2xl font-semibold mb-2">No Events Found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEventClick={onEventClick}
          isBookmarked={bookmarkedEvents.has(event.id)}
          toggleBookmark={toggleBookmark}
          isClient={isClient}
        />
      ))}
    </div>
  );
}
