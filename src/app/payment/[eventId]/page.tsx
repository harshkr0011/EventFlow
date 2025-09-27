
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { allEvents } from '@/lib/events';
import type { Event } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CreditCard, Calendar, Lock } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const paymentSchema = z.object({
  name: z.string().min(2, 'Name on card is required'),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value), 'Card number must be 16 digits'),
  expiryDate: z.string().refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), 'Expiry date must be in MM/YY format'),
  cvv: z.string().refine((value) => /^\d{3}$/.test(value), 'CVV must be 3 digits'),
});

const upiSchema = z.object({
  upiId: z.string().refine((value) => /^[\w.-]+@[\w.-]+$/.test(value), 'Please enter a valid UPI ID'),
});


type PaymentFormData = z.infer<typeof paymentSchema>;
type UpiFormData = z.infer<typeof upiSchema>;


export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.eventId as string;
  const [event, setEvent] = React.useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isUpiSubmitting, setIsUpiSubmitting] = React.useState(false);


  React.useEffect(() => {
    const foundEvent = allEvents.find((e) => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
        toast({
            variant: "destructive",
            title: "Event not found",
            description: "The event you are trying to book could not be found.",
        })
      router.push('/dashboard');
    }
  }, [eventId, router, toast]);

  const {
    register: registerCard,
    handleSubmit: handleCardSubmit,
    formState: { errors: cardErrors, isSubmitting: isCardSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const {
    register: registerUpi,
    handleSubmit: handleUpiSubmit,
    formState: { errors: upiErrors },
    reset: resetUpi,
  } = useForm<UpiFormData>({
    resolver: zodResolver(upiSchema),
  });

  const handleSuccessfulPayment = () => {
    toast({
      title: 'Payment Successful!',
      description: `Your ticket for "${event?.title}" has been booked.`,
    });
    
    router.push('/dashboard');
  }

  const onCardPayment = async (data: PaymentFormData) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    handleSuccessfulPayment();
  };
  
  const onUpiPayment = async (data: UpiFormData) => {
    setIsUpiSubmitting(true);
     // Simulate UPI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    handleSuccessfulPayment();
    setIsUpiSubmitting(false);
    resetUpi();
  }

  if (!event) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <main className="flex-grow container mx-auto py-12 px-4">
                 <Skeleton className="h-96 w-full max-w-2xl mx-auto" />
            </main>
            <Footer />
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to events
                </Link>
            </Button>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">{event.venue}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p>Ticket Price</p>
                                    <p className="font-semibold">₹{event.price}</p>
                                </div>
                                 <div className="flex justify-between items-center text-lg font-bold">
                                    <p>Total</p>
                                    <p>₹{event.price}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                          <CardTitle>Pay with UPI</CardTitle>
                          <CardDescription>Enter your UPI ID to pay.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleUpiSubmit(onUpiPayment)}>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="upiId">UPI ID</Label>
                               <Input id="upiId" {...registerUpi('upiId')} placeholder="yourname@bank" />
                               {upiErrors.upiId && <p className="text-sm text-destructive">{upiErrors.upiId.message}</p>}
                            </div>
                          </CardContent>
                          <CardFooter>
                              <Button type="submit" className="w-full" disabled={isUpiSubmitting}>
                                {isUpiSubmitting ? 'Processing...' : `Pay ₹${event.price} via UPI`}
                              </Button>
                          </CardFooter>
                        </form>
                    </Card>
                </div>


                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Pay with Card</CardTitle>
                        <CardDescription>Enter your card information to complete the purchase.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleCardSubmit(onCardPayment)}>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Name on Card</Label>
                                <Input id="name" {...registerCard('name')} placeholder="John Doe" />
                                {cardErrors.name && <p className="text-sm text-destructive">{cardErrors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="cardNumber" {...registerCard('cardNumber')} placeholder="0000 0000 0000 0000" className="pl-9" />
                                </div>
                                {cardErrors.cardNumber && <p className="text-sm text-destructive">{cardErrors.cardNumber.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiryDate">Expiry</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="expiryDate" {...registerCard('expiryDate')} placeholder="MM/YY" className="pl-9" />
                                    </div>
                                    {cardErrors.expiryDate && <p className="text-sm text-destructive">{cardErrors.expiryDate.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="cvv" {...registerCard('cvv')} placeholder="123" className="pl-9" />
                                    </div>
                                    {cardErrors.cvv && <p className="text-sm text-destructive">{cardErrors.cvv.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={isCardSubmitting}>
                                {isCardSubmitting ? 'Processing...' : `Pay ₹${event.price}`}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
