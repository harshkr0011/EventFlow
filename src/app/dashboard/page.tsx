
'use client';

import type { Event } from '@/lib/types';
import { allEvents, eventCategories } from '@/lib/events';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { EventList } from '@/components/event-list';
import { EventDetailsDialog } from '@/components/event-details-dialog';
import { RecommendationTool } from '@/components/recommendation-tool';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter } from 'lucide-react';
import { Chatbot } from '@/components/chatbot';
import { useIsMobile } from '@/hooks/use-mobile';
import { EventDetailsDrawer } from '@/components/event-details-drawer';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = React.useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = React.useState('all');
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  React.useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('bookmarkedEvents');
      if (saved) {
        setBookmarkedEvents(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Failed to parse bookmarked events from localStorage', error);
    }
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredEvents = React.useMemo(() => {
    let events = allEvents;
    
    if (activeTab === 'featured') {
      events = events.filter((event) => event.category === 'Featured');
    } else if (activeTab === 'bookmarked') {
      events = events.filter((event) => bookmarkedEvents.has(event.id));
    }

    if (selectedCategories.length > 0) {
      events = events.filter((event) => selectedCategories.includes(event.category));
    }

    if (debouncedSearchTerm) {
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    return events;
  }, [debouncedSearchTerm, selectedCategories, activeTab, bookmarkedEvents]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleBookmark = (eventId: string) => {
    const newBookmarkedEvents = new Set(bookmarkedEvents);
    if (newBookmarkedEvents.has(eventId)) {
      newBookmarkedEvents.delete(eventId);
    } else {
      newBookmarkedEvents.add(eventId);
    }
    setBookmarkedEvents(newBookmarkedEvents);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookmarkedEvents', JSON.stringify(Array.from(newBookmarkedEvents)));
    }
  };
  
  if (loading || !user || isMobile === undefined) {
    return (
      <div className="flex flex-col min-h-screen w-full p-8 space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-8">
              <Skeleton className="h-64 hidden md:block" />
              <div className="md:col-span-3 space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-48 w-full" />
              </div>
          </div>
      </div>
    )
  }

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent font-body text-foreground">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Find Your Next Experience
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover, book, and enjoy unforgettable events. Your next great memory is just a click away.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
              </TabsList>
            </Tabs>

           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
               {eventCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-col gap-8">
          <div>
            <EventList
              events={filteredEvents}
              onEventClick={handleEventSelect}
              bookmarkedEvents={bookmarkedEvents}
              toggleBookmark={toggleBookmark}
              isClient={isClient}
            />
          </div>
        </div>
        
        <RecommendationTool allEvents={allEvents} onEventClick={handleEventSelect} />

      </main>
      <Footer />
       {isMobile ? (
         <EventDetailsDrawer
            event={selectedEvent}
            onOpenChange={(isOpen) => !isOpen && handleClose()}
            isBookmarked={!!selectedEvent && bookmarkedEvents.has(selectedEvent.id)}
            toggleBookmark={toggleBookmark}
         />
       ) : (
         <EventDetailsDialog
            event={selectedEvent}
            onOpenChange={(isOpen) => !isOpen && handleClose()}
            isBookmarked={!!selectedEvent && bookmarkedEvents.has(selectedEvent.id)}
            toggleBookmark={toggleBookmark}
          />
       )}
      <Chatbot />
    </div>
  );
}
