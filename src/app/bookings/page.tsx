
'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { onBookingsSnapshot } from '@/lib/firebase-service';
import type { Booking, Event } from '@/lib/types';
import { allEvents } from '@/lib/events';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [bookedEvents, setBookedEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (user) {
      setLoading(true);
      const unsubscribe = onBookingsSnapshot(
        user.uid,
        (userBookings) => {
          setBookings(userBookings);
          const events = userBookings
            .map((booking) => allEvents.find((event) => event.id === booking.eventId))
            .filter((event): event is Event => !!event);
          setBookedEvents(events);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          toast({
            variant: 'destructive',
            title: 'Error loading bookings',
            description: 'Could not fetch your booked events. Please try again later.',
          });
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user, toast]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
             <Skeleton className="h-10 w-1/3" />
             <Skeleton className="h-8 w-1/2" />
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                ))}
             </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-muted-foreground mt-2">Here are all the events you've booked.</p>
        </div>

        {bookedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-96 rounded-lg bg-muted/50">
            <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-4">You haven't booked any events. Let's find something amazing!</p>
            <Button asChild>
                <Link href="/dashboard">Explore Events</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookedEvents.map((event) => {
              const placeholder = PlaceHolderImages.find((p) => p.id === event.imageId);
              const booking = bookings.find(b => b.eventId === event.id);
              return (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-40 w-full">
                    <Image
                        src={placeholder?.imageUrl || `https://picsum.photos/seed/${event.id}/400/200`}
                        alt={event.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    Booked on: {booking ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                   <div className="flex items-center mb-2"><Calendar className="mr-2 h-4 w-4" /> {new Date(event.date).toLocaleString('en-IN')}</div>
                   <div className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {event.venue}</div>
                </CardContent>
              </Card>
            )})}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
