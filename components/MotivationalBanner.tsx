
import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { Sparkles } from 'lucide-react';

interface Props {
  quotes: Quote[];
}

const MotivationalBanner: React.FC<Props> = ({ quotes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 500); // Wait for fade out
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [quotes]);

  if (quotes.length === 0) return null;

  return (
    <div className="bg-slate-900 border-b border-white/5 py-3 px-4 overflow-hidden relative group">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
        <Sparkles size={14} className="text-emerald-400 shrink-0 animate-pulse" />
        <p 
          className={`text-xs md:text-sm font-bold text-slate-200 text-center transition-all duration-500 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {quotes[currentIndex]?.text}
        </p>
        <Sparkles size={14} className="text-emerald-400 shrink-0 animate-pulse" />
      </div>
      
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 pointer-events-none opacity-50"></div>
    </div>
  );
};

export default MotivationalBanner;
