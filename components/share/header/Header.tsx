'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import SettingsPanel from '../SettingsPanel';

const Header = ({ title }: { title: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="flex items-center justify-between border-b border-background pb-5 px-6">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <div className="flex items-center space-x-4">
        {/* <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 w-4 h-4" />
          <input
            type="text"
            placeholder="Type keywords to search..."
            className="pl-10 pr-4 py-3 border text-sm border-border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
          />
        </div> */}

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-foreground/60 hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-card">
            <SettingsPanel onClose={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
};

export default Header;
