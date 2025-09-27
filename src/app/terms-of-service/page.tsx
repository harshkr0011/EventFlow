
'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground prose dark:prose-invert max-w-none">
             <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the EventFlow website (the "Service") operated by EventFlow ("us", "we", or "our").
            </p>

            <p>
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>

            <h3 className="text-xl font-semibold text-foreground">Accounts</h3>
            <p>
                When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>

            <h3 className="text-xl font-semibold text-foreground">Intellectual Property</h3>
            <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of EventFlow and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries, including the Copyright Act, 1957 and the Trade Marks Act, 1999. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of EventFlow.
            </p>

            <h3 className="text-xl font-semibold text-foreground">Links To Other Web Sites</h3>
            <p>
                Our Service may contain links to third-party web sites or services that are not owned or controlled by EventFlow. EventFlow has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground">Termination</h3>
            <p>
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h3 className="text-xl font-semibold text-foreground">Governing Law</h3>
            <p>
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-foreground">Contact Us</h3>
            <p>
                If you have any questions about these Terms, please contact us.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
