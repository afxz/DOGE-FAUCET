import React from 'react';
import { BitcoinIcon as DogecoinIcon } from 'lucide-react';
import { ClaimForm } from './components/ClaimForm';
import { AdPlacement } from './components/AdPlacement';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <AdPlacement position="header" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <DogecoinIcon className="w-12 h-12 text-yellow-500 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">DOGE Faucet</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-2 space-y-4">
            <AdPlacement position="sidebarTop" />
            <AdPlacement position="sidebarMiddle" />
            <AdPlacement position="sidebarBottom" />
            <AdPlacement 
              position="sidebarSticky" 
              className="sticky top-4 hidden md:block"
            />
          </div>

          <div className="md:col-span-8">
            <ClaimForm />
            <div className="mt-8">
              <AdPlacement position="inContent" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <AdPlacement position="sidebarTop" />
            <AdPlacement position="sidebarMiddle" />
            <AdPlacement position="sidebarBottom" />
            <AdPlacement 
              position="sidebarSticky" 
              className="sticky top-4 hidden md:block"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AdPlacement position="footer" />
      </div>
    </div>
  );
}

export default App;