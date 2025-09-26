
'use client';

import type { Event } from '@/lib/types';
import { allEvents, eventCategories } from '@/lib/events';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventList } from '@/components/event-list';
import { EventFilters } from '@/components/event-filters';
import { EventDetailsDialog } from '@/components/event-details-dialog';
import { RecommendationTool } from '@/components/recommendation-tool';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useDebounce } from '@/hooks/use-debounce';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function Home() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [bookmarkedEvents, setBookmarkedEvents] = React.useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = React.useState('all');
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const isMobile = useIsMobile();

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

    if (activeTab === 'bookmarked') {
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
  
  const eventFilters = (
    <EventFilters
      categories={eventCategories}
      selectedCategories={selectedCategories}
      onCategoryChange={handleCategoryChange}
    />
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent font-body text-foreground">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} setShowFilters={setShowFilters} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Find Your Next Experience
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover, book, and enjoy unforgettable events. Your next great memory is just a click away.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex justify-center mb-8">
          <TabsList className="bg-primary/10">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {isMobile ? (
             <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetContent side="left" className="w-3/4">
                    {eventFilters}
                </SheetContent>
             </Sheet>
          ) : (
            <aside className="lg:col-span-1">
              {eventFilters}
            </aside>
          )}
          <div className="lg:col-span-3">
            <EventList
              events={filteredEvents}
              onEventClick={setSelectedEvent}
              bookmarkedEvents={bookmarkedEvents}
              toggleBookmark={toggleBookmark}
              isClient={isClient}
            />
          </div>
        </div>
        
        <RecommendationTool allEvents={allEvents} onEventClick={setSelectedEvent} />

      </main>
      <Footer />
      <EventDetailsDialog
        event={selectedEvent}
        onOpenChange={(isOpen) => !isOpen && setSelectedEvent(null)}
        isBookmarked={!!selectedEvent && bookmarkedEvents.has(selectedEvent.id)}
        toggleBookmark={toggleBookmark}
      />
    </div>
  );
}
