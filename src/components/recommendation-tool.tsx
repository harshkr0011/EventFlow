
'use client';
import * as React from 'react';
import { personalizedEventRecommendations } from '@/ai/flows/personalized-event-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { eventCategories } from '@/lib/events';
import type { Event } from '@/lib/types';
import { EventList } from './event-list';
import { Wand2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

type RecommendationToolProps = {
    allEvents: Event[];
    onEventClick: (event: Event) => void;
}

export function RecommendationTool({ allEvents, onEventClick }: RecommendationToolProps) {
  const [preferences, setPreferences] = React.useState<string[]>([]);
  const [recommendedEvents, setRecommendedEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [bookmarkedEvents, setBookmarkedEvents] = React.useState<Set<string>>(new Set());
  const [isClient, setIsClient] = React.useState(false);

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

  const handlePreferenceChange = (category: string) => {
    setPreferences((prev) =>
      prev.includes(category) ? prev.filter((p) => p !== category) : [...prev, category]
    );
  };

  const getRecommendations = async () => {
    setLoading(true);
    setRecommendedEvents([]);
    try {
      const allEventTitles = allEvents.map((e) => e.title);
      const result = await personalizedEventRecommendations({
        userPreferences: preferences,
        pastBookingHistory: [],
        allEvents: allEventTitles,
      });

      const recommended = allEvents.filter(event => result.recommendedEvents.includes(event.title));
      setRecommendedEvents(recommended);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16">
      <Card className="bg-card/60 backdrop-blur-lg border border-border/10 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Wand2 className="mr-2 h-6 w-6 text-primary" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Tell us what you like, and our AI will suggest events you're sure to love.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Select your interests:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {eventCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pref-${category}`}
                    checked={preferences.includes(category)}
                    onCheckedChange={() => handlePreferenceChange(category)}
                  />
                  <Label htmlFor={`pref-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={getRecommendations} disabled={loading || preferences.length === 0} className="bg-gradient-primary text-primary-foreground">
            {loading ? 'Thinking...' : 'Get Recommendations'}
          </Button>
          
          {(loading || recommendedEvents.length > 0) && <div className="mt-8">
              <h4 className="text-xl font-bold mb-4">Recommended For You</h4>
              {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                  </div>
              ) : (
                <EventList 
                    events={recommendedEvents} 
                    onEventClick={onEventClick}
                    bookmarkedEvents={bookmarkedEvents}
                    toggleBookmark={toggleBookmark}
                    isClient={isClient}
                />
              )}
          </div>}
        </CardContent>
      </Card>
    </section>
  );
}
