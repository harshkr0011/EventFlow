
import type { Event } from '@/lib/types';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bookmark, Calendar, Facebook, Linkedin, MapPin, Twitter, Share2, CalendarPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventComments } from './event-comments';

type EventDetailsDialogProps = {
  event: Event | null;
  onOpenChange: (open: boolean) => void;
  isBookmarked: boolean;
  toggleBookmark: (eventId: string) => void;
};

const socialPlatforms = [
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/intent/tweet?text=' },
  { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/sharer/sharer.php?u=' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/shareArticle?mini=true&url=' },
];

export function EventDetailsDialog({ event, onOpenChange, isBookmarked, toggleBookmark }: EventDetailsDialogProps) {
  if (!event) return null;

  const placeholder = PlaceHolderImages.find((p) => p.id === event.imageId);
  const eventUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard?eventId=${event.id}` : '';

  const generateGoogleCalendarLink = () => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Assume 2 hour duration

    const toGoogleFormat = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, '');
    };

    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.venue);
    const startTime = toGoogleFormat(startDate);
    const endTime = toGoogleFormat(endDate);

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  };

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="relative h-48 md:h-full w-full">
            <Image
              src={placeholder?.imageUrl || `https://picsum.photos/seed/${event.id}/600/800`}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              data-ai-hint={placeholder?.imageHint || 'event portrait'}
            />
        </div>
        <ScrollArea className="max-h-[70vh] md:max-h-[90vh]">
            <div className="p-4 md:p-6">
              <DialogHeader className="mb-4">
                <Badge variant="secondary" className="w-fit mb-2">{event.category}</Badge>
                <DialogTitle className="text-xl md:text-3xl font-bold">{event.title}</DialogTitle>
                <DialogDescription className="text-sm md:text-base text-muted-foreground">
                  Organized by {event.organizer}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-muted-foreground mb-4 text-sm md:text-base">
                <div className="flex items-center"><Calendar className="mr-2 h-4 w-4 text-primary" /> {new Date(event.date).toLocaleString('en-IN')}</div>
                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary" /> {event.venue}</div>
              </div>
              
              <p className="mb-6 text-foreground text-sm md:text-base">{event.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg md:text-2xl font-bold text-primary">₹{event.price}</p>
                <Button className="bg-gradient-primary text-primary-foreground font-bold" size="lg">Book Now</Button>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Share:</span>
                    {socialPlatforms.map(p => (
                        <a key={p.name} href={`${p.url}${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(`Check out this event: ${event.title}`)}`} target="_blank" rel="noopener noreferrer">
                           <Button variant="outline" size="icon" className="h-8 w-8">
                               <p.icon className="h-4 w-4" />
                           </Button>
                        </a>
                    ))}
                </div>
                 <div className='flex items-center gap-2'>
                    <Button asChild variant="outline">
                        <a href={generateGoogleCalendarLink()} target="_blank" rel="noopener noreferrer">
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Add to Calendar
                        </a>
                    </Button>
                    <Button variant="outline" onClick={() => toggleBookmark(event.id)}>
                        <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-primary' : ''}`} />
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </Button>
                 </div>
              </div>

              <Separator className="my-4" />

              <EventComments eventId={event.id} />
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
