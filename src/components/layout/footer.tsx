
import { Ticket, Twitter, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-sm text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold">EventFlow</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Your ultimate destination for discovering and booking unforgettable events.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

           <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
             <p className="text-muted-foreground text-sm mb-2">Stay updated with the latest events.</p>
             {/* Newsletter form can be added here */}
          </div>
        </div>

        <div className="mt-8 border-t pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EventFlow. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
                <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
