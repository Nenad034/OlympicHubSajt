'use client';

/**
 * HeroSearch Component - Predictive Hero Section
 * 
 * Features:
 * - Adapts based on user's local time and weather
 * - Shows relevant destinations based on user context
 * - Natural language search input
 * - Framer Motion animations
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UserContext {
  weather?: 'sunny' | 'rainy' | 'cloudy';
  previousCategory?: 'family' | 'luxury' | 'adventure';
  location?: string;
}

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userContext, setUserContext] = useState<UserContext>({});
  const [suggestedDestinations, setSuggestedDestinations] = useState<string[]>([]);

  useEffect(() => {
    // Simulate user context detection
    const detectUserContext = () => {
      // Check cookies or localStorage for previous searches
      const previousCategory = localStorage.getItem('previousCategory') as 'family' | 'luxury' | 'adventure' | null;
      
      // Simulate weather detection (in production, use actual weather API)
      const mockWeather = Math.random() > 0.5 ? 'rainy' : 'sunny';
      
      setUserContext({
        weather: mockWeather,
        previousCategory: previousCategory || undefined,
        location: 'Belgrade',
      });

      // Set suggested destinations based on context
      if (mockWeather === 'rainy') {
        setSuggestedDestinations(['Greece', 'Turkey', 'Egypt']);
      } else if (previousCategory === 'family') {
        setSuggestedDestinations(['Croatia', 'Montenegro', 'Italy']);
      } else {
        setSuggestedDestinations(['Spain', 'Portugal', 'Greece']);
      }
    };

    detectUserContext();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would trigger AI search
    console.log('Searching for:', searchQuery);
  };

  const getPredictiveMessage = () => {
    if (userContext.weather === 'rainy') {
      return "It's rainy today - how about some sunny destinations? ☀️";
    }
    if (userContext.previousCategory === 'family') {
      return "We found the best family resorts for you! 👨‍👩‍👧‍👦";
    }
    return "Where would you like to go next? ✈️";
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="max-w-4xl mx-auto px-4 py-20 text-center z-10">
        {/* Predictive Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {getPredictiveMessage()}
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600"
        >
          Your Next Adventure Awaits
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Tell us what you&apos;re looking for in natural language. Our AI will find the perfect trip for you.
        </motion.p>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="e.g., I want a luxury hotel in Crete for 5 days in July..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg shadow-lg border-2 focus:border-primary"
              />
            </div>
            <Button type="submit" size="lg" className="mt-4 px-8">
              Search Packages
            </Button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" size="sm" className="gap-2">
              <MapPin className="w-4 h-4" />
              Destination
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              Dates
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Travelers
            </Button>
          </div>
        </motion.div>

        {/* Suggested Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-600 mb-4">Popular destinations right now:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {suggestedDestinations.map((destination, index) => (
              <motion.div
                key={destination}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <Card className="px-4 py-2 cursor-pointer hover:shadow-md transition-shadow">
                  <span className="font-medium">{destination}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
