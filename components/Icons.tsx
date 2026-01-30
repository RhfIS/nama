
import React from 'react';

export const SavingsJarIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Base of the jar */}
    <path d="M6 10c0-2 2-3 2-3h8s2 1 2 3v8c0 2-2 3-2 3H8c-2 0-2-1-2-3v-8z" />
    {/* Top/Neck of the jar */}
    <path d="M9 7V5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2" />
    {/* Coin Slot */}
    <line x1="10" y1="12" x2="14" y2="12" />
    {/* Decorative line */}
    <path d="M6 15h12" />
  </svg>
);
