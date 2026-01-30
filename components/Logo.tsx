
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const textSizes = {
    sm: 'text-3xl',
    md: 'text-5xl',
    lg: 'text-8xl',
  };

  const subTextSizes = {
    sm: 'text-[9px]',
    md: 'text-[12px]',
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center select-none group cursor-pointer">
      <div className="flex flex-col">
        {/* Brand Name */}
        <h1 
          className={`${textSizes[size]} font-brand leading-none tracking-tighter text-slate-900 transition-all duration-500 group-hover:text-[#00509d]`}
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
        >
          نماء
        </h1>
        
        {/* Localization Label with Vivid Accent */}
        <div className="flex flex-col mt-2">
          <span className={`${subTextSizes[size]} font-black opacity-80 tracking-[0.4em] text-[#00a896] uppercase group-hover:tracking-[0.45em] transition-all duration-700`}>
            MADE IN SAUDI
          </span>
          <div className="relative h-[3px] w-full mt-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="absolute inset-0 bg-gradient-to-l from-[#00509d] via-[#00a896] to-transparent transform group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-[#00509d] via-[#00a896] to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
