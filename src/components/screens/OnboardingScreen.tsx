import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Heart, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';

const slides = [
  {
    icon: MapPin,
    title: 'Find Parking Near You',
    description: 'Discover available parking spots in real-time, right where you need them.'
  },
  {
    icon: Clock,
    title: 'Reserve Instantly',
    description: 'Book your parking spot in seconds and never worry about availability.'
  },
  {
    icon: Heart,
    title: 'Save Time, Reduce Stress',
    description: 'Skip the hassle of circling around. Get to your destination faster.'
  }
];

export const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setCurrentScreen } = useApp();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentScreen('login');
    }
  };

  const handleSkip = () => {
    setCurrentScreen('login');
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSkip}
          className="text-muted-foreground px-4 py-2"
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-32 h-32 mx-auto mb-8 bg-[#1E90FF]/10 rounded-full flex items-center justify-center"
            >
              {React.createElement(slides[currentSlide].icon, {
                className: "w-16 h-16 text-[#1E90FF]",
                strokeWidth: 2
              })}
            </motion.div>

            <h2 className="mb-4 text-foreground">
              {slides[currentSlide].title}
            </h2>

            <p className="text-muted-foreground max-w-sm mx-auto">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-[#1E90FF]'
                : 'w-2 bg-border'
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <div className="px-8 pb-8">
        <Button
          onClick={handleNext}
          className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white rounded-xl h-14"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
