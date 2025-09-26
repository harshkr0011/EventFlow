
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
import { Bookmark, Calendar, Facebook, Linkedin, MapPin, MessageSquare, Twitter, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

const mockComments = [
    { user: 'Alex D.', text: "Can't wait for this! Looks amazing.", avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { user: 'Sara K.', text: 'Is there parking available?', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
];

export function EventDetailsDialog({ event, onOpenChange, isBookmarked, toggleBookmark }: EventDetailsDialogProps) {
  if (!event) return null;

  const placeholder = PlaceHolderImages.find((p) => p.id === event.imageId);
  const eventUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-full">
                <Image
                  src={placeholder?.imageUrl || `https://picsum.photos/seed/${event.id}/600/800`}
                  alt={event.title}
                  fill
                  className="object-cover rounded-l-lg"
                  data-ai-hint={placeholder?.imageHint || 'event portrait'}
                />
            </div>
            <div className="p-6 flex flex-col">
              <DialogHeader className="mb-4">
                <Badge variant="secondary" className="w-fit mb-2">{event.category}</Badge>
                <DialogTitle className="text-3xl font-bold">{event.title}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Organized by {event.organizer}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-muted-foreground mb-4">
                <div className="flex items-center"><Calendar className="mr-2 h-4 w-4 text-primary" /> {new Date(event.date).toLocaleString()}</div>
                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-primary" /> {event.venue}</div>
              </div>
              
              <p className="mb-6 text-foreground flex-grow">{event.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-primary">${event.price}</p>
                <Button className="bg-gradient-primary text-primary-foreground font-bold" size="lg">Book Now</Button>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Share:</span>
                    {socialPlatforms.map(p => (
                        <a key={p.name} href={`${p.url}${eventUrl}&text=Check out this event: ${event.title}`} target="_blank" rel="noopener noreferrer">
                           <Button variant="outline" size="icon" className="h-8 w-8">
                               <p.icon className="h-4 w-4" />
                           </Button>
                        </a>
                    ))}
                </div>
                <Button variant="outline" onClick={() => toggleBookmark(event.id)}>
                  <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-primary' : ''}`} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-2 flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-primary"/> Comments</h4>
                <div className="space-y-4 max-h-32 overflow-y-auto pr-2">
                  {mockComments.map((comment, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{comment.user}</p>
                        <p className="text-sm text-muted-foreground">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <Textarea placeholder="Add a comment..." className="flex-grow"/>
                    <Button>Post</Button>
                </div>
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
