
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';

const skills = {
    Languages: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'PHP', 'SQL'],
    Frontend: ['HTML', 'CSS', 'Tailwind CSS', 'React.js'],
    'Backend & Databases': ['Node.js', 'Express.js', 'MongoDB', 'MySQL', 'PHP'],
    Tools: ['Git', 'GitHub', 'REST APIs', 'Debugging'],
};

export default function AboutPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-primary/10 p-8 flex flex-col items-center justify-center">
              <Image
                src="https://placehold.co/150x150/7c3aed/white?text=HK"
                alt="Harsh Kumar"
                width={150}
                height={150}
                className="rounded-full border-4 border-background shadow-lg"
              />
              <h1 className="text-2xl font-bold mt-4 text-center">Harsh Kumar</h1>
              <p className="text-muted-foreground text-center">B.Tech CSE Student</p>
               <div className="flex space-x-3 mt-4">
                  <a href="mailto:harshkr0011@gmail.com" className="text-muted-foreground hover:text-primary"><Mail /></a>
               </div>
            </div>
            <div className="md:w-2/3 p-8">
              <CardHeader className='p-0 mb-6'>
                <CardTitle className="text-3xl font-bold">About Me</CardTitle>
                <CardDescription>Full-Stack Developer | Vice President @ Pioneers Club | Perplexity Campus Partner</CardDescription>
              </CardHeader>
              <CardContent className='p-0'>
                <p className="text-foreground/90 mb-6">
                  I am a B.Tech CSE student at Lovely Professional University, currently working as a Web Developer Intern at EazyByts, focusing on Full-Stack Development (MERN) and building scalable, user-friendly applications.
                </p>
                <p className="text-foreground/90 mb-6">
                  I also serve as Vice President of the Pioneers Club (LPU), fostering creativity through non-technical activities, and as a Campus Partner at Perplexity, where I engage students to explore AI tools and Comet Browser. Passionate about software development, leadership, and continuous learning, I aim to contribute to impactful projects and innovations.
                </p>

                <div className="space-y-4">
                    {Object.entries(skills).map(([category, skillsList]) => (
                        <div key={category}>
                            <h3 className="font-semibold mb-2">{category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {skillsList.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                            </div>
                        </div>
                    ))}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
