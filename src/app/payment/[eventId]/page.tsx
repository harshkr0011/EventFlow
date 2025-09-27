
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

type PaymentFormData = z.infer<typeof paymentSchema>;

const UpiProviderIcon = ({ provider }: { provider: 'gpay' | 'phonepe' | 'paytm' }) => {
  const icons = {
    gpay: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="24" viewBox="0 0 125.12 40">
        <path d="M21.1,1.88,16.4,20.08,11.7,1.88H.2L14.05,38.28h9.4L37.3,1.88Z" fill="#5f6368"/>
        <path d="M68.52,22.19c0,5.1-3.1,8.3-8.4,8.3a13.3,13.3,0,0,1-9-3.7l5.3-5.7a6.26,6.26,0,0,0,3.7,1.5c2,0,3.3-1.1,3.3-2.9,0-1.9-1.3-2.7-3.6-3.8-3-1.4-5.3-3.2-5.3-6.5,0-3.9,3.1-6.2,7.3-6.2a11.13,11.13,0,0,1,8.2,3.3l-5.1,5.3a5.27,5.27,0,0,0-3.3-1.3c-1.5,0-2.5,1-2.5,2.4,0,1.7,1.1,2.4,3.8,3.7C66.52,17.79,68.52,19.39,68.52,22.19Z" fill="#5f6368"/>
        <path d="M86.32,22.19c0,5.1-3.1,8.3-8.4,8.3a13.3,13.3,0,0,1-9-3.7l5.3-5.7a6.26,6.26,0,0,0,3.7,1.5c2,0,3.3-1.1,3.3-2.9,0-1.9-1.3-2.7-3.6-3.8-3-1.4-5.3-3.2-5.3-6.5,0-3.9,3.1-6.2,7.3-6.2a11.13,11.13,0,0,1,8.2,3.3l-5.1,5.3a5.27,5.27,0,0,0-3.3-1.3c-1.5,0-2.5,1-2.5,2.4,0,1.7,1.1,2.4,3.8,3.7C84.32,17.79,86.32,19.39,86.32,22.19Z" fill="#5f6368"/>
        <path d="M103,30.19c-4,0-6.7-2.6-6.7-6.5,0-4,2.7-6.5,6.7-6.5s6.7,2.5,6.7,6.5C109.72,27.59,107,30.19,103,30.19Zm0-17c-6.1,0-10.4,4.2-10.4,10.7s4.3,10.7,10.4,10.7,10.4-4.2,10.4-10.7S109.12,13.19,103,13.19Z" fill="#5f63.68"/>
        <path d="M43.78,13.68h6v24.6h-6Z" fill="#5f6368"/>
        <path d="M118.84,13.68h5.9l.3,5h.3c1.7-3.8,5.4-6.1,9.8-6.1,1,0,1.9.1,2.8.3l-.8,6.8c-.6-.2-1.3-.3-2.1-.3-5,0-8.5,3.5-8.5,9.4v9.5h-7Z" fill="#5f6368"/>
      </svg>
    ),
    phonepe: (
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="24" viewBox="0 0 98.2 24.5">
            <path d="M85.4 12.3c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6zm-20.9-5.3h-4.3v10.5h4.3v-10.5zm-5.6 0h-4.3v10.5h4.3v-10.5zm31.8 0h-4.3v10.5h4.3v-10.5zm-16.7 0h-4.3v10.5h4.3v-10.5zm-15.6 5.3c0-3.3-2.7-6-6-6s-6 2.7-6 6 2.7 6 6 6 6-2.7 6-6zm-20.9-5.3h-4.3v10.5h4.3v-10.5zm-5.6 0h-4.3v10.5h4.3v-10.5z" fill="#fff"/>
            <path d="M12.3 0C5.5 0 0 5.5 0 12.3s5.5 12.3 12.3 12.3 12.3-5.5 12.3-12.3S19.1 0 12.3 0zm0 19.3c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z" fill="#fff"/>
            <path d="M92.2 7h4.3v10.5h-4.3zM46.9 7h4.3v10.5h-4.3zM23.1 7h4.3v10.5h-4.3z" fill="#fff"/>
        </svg>
    ),
    paytm: (
      <svg xmlns="http://www.w3.org/2000/svg" width="70" height="24" viewBox="0 0 124 38">
        <path d="M91.8,11.2V32.4h8.9v-28H87.1L78.2,16.8,69.3,4.4H55.7v28h8.9V11.2l9.2,12.7,9-12.7Z" fill="#00baf2"/>
        <path d="M38.8,32.4h8.9V4.4H38.8Zm-15.6,0h8.9V4.4H23.2ZM50.6,4.4V11H11.4V4.4H2.5V32.4h8.9V17.9H50.6V32.4h8.9V4.4Z" fill="#002e6e"/>
        <path d="M124,11.2V32.4h8.9v-28h-13.6l-8.9,12.4L101.5,4.4H87.9v28h8.9V11.2l9.2,12.7,9-12.7Z" fill="#00baf2"/>
      </svg>
    ),
  };

  return <div className="h-6 flex items-center justify-center">{icons[provider]}</div>;
};


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

  const handleSuccessfulPayment = () => {
    toast({
      title: 'Payment Successful!',
      description: `Your ticket for "${event?.title}" has been booked.`,
    });
    
    router.push('/dashboard');
  }

  const onCardSubmit = async (data: PaymentFormData) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    handleSuccessfulPayment();
  };
  
  const onUpiSubmit = async () => {
     // Simulate UPI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    handleSuccessfulPayment();
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
                            <CardTitle>UPI / Wallets</CardTitle>
                            <CardDescription>Pay with your favorite UPI app.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <Button className="w-full h-14 bg-[#5F6368] hover:bg-[#5F6368]/90" onClick={onUpiSubmit}>
                               <UpiProviderIcon provider="gpay" />
                           </Button>
                           <Button className="w-full h-14 bg-[#6739B7] hover:bg-[#6739B7]/90" onClick={onUpiSubmit}>
                               <UpiProviderIcon provider="phonepe" />
                           </Button>
                           <Button className="w-full h-14 bg-[#002E6E] hover:bg-[#002E6E]/90" onClick={onUpiSubmit}>
                               <UpiProviderIcon provider="paytm" />
                           </Button>
                        </CardContent>
                    </Card>
                </div>


                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Pay with Card</CardTitle>
                        <CardDescription>Enter your card information to complete the purchase.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit(onCardSubmit)}>
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

    