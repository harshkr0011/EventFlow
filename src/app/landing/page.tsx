
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, Map, Users } from 'lucide-react';
import { allEvents } from '@/lib/events';
import { EventCard } from '@/components/event-card';
import type { Event } from '@/lib/types';
import { useRouter } from 'next/navigation';


function HowItWorksStep({ icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    const Icon = icon;
    return (
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Icon className="w-8 h-8 text-primary" />
                </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    )
}


export default function LandingPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const featuredEvents = allEvents.filter(e => e.category === 'Featured').slice(0, 3);
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 text-center text-white bg-gradient-to-tr from-gray-900 to-gray-800">
                    <div className="absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Concert crowd"
                            fill
                            className="object-cover opacity-30"
                            priority
                        />
                         <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className="container relative">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in">
                            Your Ultimate Event Destination
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            From sold-out concerts to local art shows, find and book your next unforgettable experience with EventFlow.
                        </p>
                        <Button size="lg" className="bg-primary text-primary-foreground animate-fade-in" style={{ animationDelay: '0.4s' }} asChild>
                           <Link href="/signup">
                             Get Started <ArrowRight className="ml-2 h-5 w-5" />
                           </Link>
                        </Button>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 bg-background">
                    <div className="container">
                        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-12">
                           <HowItWorksStep icon={Map} title="Discover Events" description="Explore a vast selection of events, from music festivals to tech conferences." />
                           <HowItWorksStep icon={Calendar} title="Book with Ease" description="Secure your spot in just a few clicks with our seamless booking process." />
                           <HowItWorksStep icon={Users} title="Enjoy the Show" description="Connect with communities and create lasting memories at your favorite events." />
                        </div>
                    </div>
                </section>

                {/* Featured Events Section */}
                <section className="py-20 bg-primary/5">
                     <div className="container">
                        <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredEvents.map(event => (
                               <EventCard 
                                 key={event.id}
                                 event={event}
                                 onEventClick={() => router.push('/login')}
                                 isBookmarked={false}
                                 toggleBookmark={() => {}}
                                 isClient={true}
                               />
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <Button variant="outline" asChild>
                               <Link href="/dashboard">Explore All Events</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
