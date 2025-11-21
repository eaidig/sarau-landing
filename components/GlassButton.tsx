import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'ember' | 'nature';
  href?: string;
  onClick?: () => void;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ children, variant = 'nature', href, onClick }) => {
  const isEmber = variant === 'ember';

  // Styles based on variant
  const colorClasses = isEmber
    ? 'bg-amber-600/20 border-amber-500/50 text-amber-100 hover:bg-amber-600/30 hover:border-amber-400 hover:shadow-amber-500/20'
    : 'bg-sarau/20 border-sarau/50 text-green-50 hover:bg-sarau/30 hover:border-sarau-light hover:shadow-sarau/20';

  const gradientColor = isEmber 
    ? 'from-transparent via-amber-500/10 to-transparent' 
    : 'from-transparent via-sarau-light/10 to-transparent';

  const content = (
    <>
      {/* Internal Glow Gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${gradientColor} -skew-x-12 translate-x-[-100%] group-hover:animate-[shine_1.5s_infinite]`}></div>
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center font-sans font-semibold text-lg tracking-wider w-full">
        {children}
        <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>

      {/* Button Bottom Highlight for 3D feel */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"></div>
    </>
  );

  const baseClasses = `
    relative overflow-hidden group w-full py-4 px-6 rounded-2xl
    transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02]
    backdrop-blur-md border shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]
    flex items-center justify-center
    ${colorClasses}
  `;

  if (href) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={baseClasses}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};