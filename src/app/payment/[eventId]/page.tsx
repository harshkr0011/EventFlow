
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

const paymentSchema = z.object({
  name: z.string().min(2, 'Name on card is required'),
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value), 'Card number must be 16 digits'),
  expiryDate: z.string().refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), 'Expiry date must be in MM/YY format'),
  cvv: z.string().refine((value) => /^\d{3}$/.test(value), 'CVV must be 3 digits'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = params.eventId as string;
  const [event, setEvent] = React.useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormData) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: 'Payment Successful!',
      description: `Your ticket for "${event?.title}" has been booked.`,
    });
    
    router.push('/dashboard');
  };

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
                <Card className="md:col-span-1">
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

                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>Enter your card information to complete the purchase.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Name on Card</Label>
                                <Input id="name" {...register('name')} placeholder="John Doe" />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="cardNumber" {...register('cardNumber')} placeholder="0000 0000 0000 0000" className="pl-9" />
                                </div>
                                {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiryDate">Expiry</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="expiryDate" {...register('expiryDate')} placeholder="MM/YY" className="pl-9" />
                                    </div>
                                    {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="cvv" {...register('cvv')} placeholder="123" className="pl-9" />
                                    </div>
                                    {errors.cvv && <p className="text-sm text-destructive">{errors.cvv.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={isSubmitting}>
                                {isSubmitting ? 'Processing...' : `Pay ₹${event.price}`}
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
