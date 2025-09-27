
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import '../auth.css';
import { LoginFormData, SignupFormData } from '@/lib/types';
import { Facebook, Linkedin, Twitter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

export default function AuthPage() {
  const [isRightPanelActive, setRightPanelActive] = React.useState(false);
  const { login, signup, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: isSigningUp },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };
  
  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      await signup(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="auth-body">
      <div id="recaptcha-container"></div>
      <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container sign-up-container">
            <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
              <h1>Create Account</h1>
              <div className="my-4">
              <Button onClick={handleGoogleSignIn} variant="outline" size="sm">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </div>
              <span>or use your email for registration</span>
              <input type="email" placeholder="Email" {...registerSignup('email')} />
              {signupErrors.email && <p className="error-message">{signupErrors.email.message}</p>}
              <input type="password" placeholder="Password" {...registerSignup('password')} />
              {signupErrors.password && <p className="error-message">{signupErrors.password.message}</p>}
              <input type="password" placeholder="Confirm Password" {...registerSignup('confirmPassword')} />
              {signupErrors.confirmPassword && <p className="error-message">{signupErrors.confirmPassword.message}</p>}
              <button type="submit" disabled={isSigningUp}>
                {isSigningUp ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <h1>Sign in</h1>
            <div className="my-4">
              <Button onClick={handleGoogleSignIn} variant="outline" size="sm">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" {...registerLogin('email')} />
            {loginErrors.email && <p className="error-message">{loginErrors.email.message}</p>}
            <input type="password" placeholder="Password" {...registerLogin('password')} />
            {loginErrors.password && <p className="error-message">{loginErrors.password.message}</p>}
            <Link href="/forgot-password">Forgot your password?</Link>
            <button type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To stay connected, please login with your personal info.</p>
              <button className="ghost" id="signIn" onClick={() => setRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your details and start your journey with us.</p>
              <button className="ghost" id="signUp" onClick={() => setRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
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
