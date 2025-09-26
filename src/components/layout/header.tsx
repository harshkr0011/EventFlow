
import { Search, Ticket } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export function Header({ searchTerm, setSearchTerm }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Ticket className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">EventFlow</span>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="w-full pl-9 bg-background/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:flex">Log In</Button>
          <Button className="bg-gradient-primary text-primary-foreground">Sign Up</Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
