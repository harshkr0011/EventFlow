
'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground prose dark:prose-invert max-w-none">
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>
              EventFlow ("us", "we", or "our") operates the EventFlow website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>

            <h3 className="text-xl font-semibold text-foreground">Information Collection and Use</h3>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>

            <h4 className="text-lg font-semibold text-foreground">Types of Data Collected</h4>
            <p>
              <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name, Cookies and Usage Data.
            </p>
            <p>
                <strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>

            <h3 className="text-xl font-semibold text-foreground">Use of Data</h3>
            <p>
                EventFlow uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to allow you to participate in interactive features of our Service when you choose to do so, to provide customer care and support, to provide analysis or valuable information so that we can improve the Service, to monitor the usage of the Service, and to detect, prevent and address technical issues.
            </p>
            
            <h3 className="text-xl font-semibold text-foreground">Contact Us</h3>
            <p>
                If you have any questions about this Privacy Policy, please contact us through our contact page.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
