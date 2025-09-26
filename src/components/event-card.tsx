
import type { Event } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Calendar, MapPin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type EventCardProps = {
  event: Event;
  onEventClick: (event: Event) => void;
  isBookmarked: boolean;
  toggleBookmark: (eventId: string) => void;
  isClient: boolean;
};

export function EventCard({ event, onEventClick, isBookmarked, toggleBookmark, isClient }: EventCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === event.imageId);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(event.id);
  };

  return (
    <Card
      className="group relative overflow-hidden rounded-xl border border-border/10 shadow-lg transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer bg-card/60 backdrop-blur-lg"
      onClick={() => onEventClick(event)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 rounded-full bg-black/30 text-white hover:bg-primary hover:text-white"
        onClick={handleBookmarkClick}
        aria-label="Bookmark event"
      >
        <Bookmark className={isClient && isBookmarked ? 'fill-white' : ''} />
      </Button>
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={placeholder?.imageUrl || `https://picsum.photos/seed/${event.id}/400/250`}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={placeholder?.imageHint || 'event'}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold tracking-tight mb-1 truncate">{event.title}</h3>
          <p className="text-lg font-bold text-primary">₹{event.price}</p>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{new Date(event.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="mr-2 h-4 w-4" />
          <span className="truncate">{event.venue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {event.category}
          </span>
           <Button variant="link" className="p-0 h-auto" onClick={() => onEventClick(event)}>
             View Details
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}
