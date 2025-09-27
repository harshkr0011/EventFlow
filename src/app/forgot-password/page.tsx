
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import '../auth.css';
import { ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await sendPasswordReset(data.email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for a link to reset your password.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="auth-body">
        <div className="container" style={{ minHeight: 'auto', width: '450px'}}>
            <div className="form-container" style={{ width: '100%', height: 'auto', position: 'relative', left: '0' }}>
                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '40px'}}>
                    <h1>Forgot Password</h1>
                    <p className='text-muted-foreground'>Enter your email and we&apos;ll send you a link to reset your password.</p>
                    
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...register('email')}
                        className='text-base'
                    />
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                    
                    <button type="submit" className="mt-4" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>

                     <div className="mt-4 text-center text-sm">
                        Remember your password?{' '}
                        <Link href="/login" className="underline">
                        Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
      <Button variant="default" asChild className="mt-4">
        <Link href="/landing">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
        </Link>
      </Button>
    </div>
  );
}
