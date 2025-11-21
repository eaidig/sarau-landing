import React from 'react';

export const Campfire: React.FC = () => {
  return (
    <div className="relative w-40 h-40 group cursor-pointer">
      {/* Glow Effect behind the fire - Intensifies on hover */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/20 blur-[50px] rounded-full group-hover:bg-orange-500/40 group-hover:w-64 group-hover:h-64 transition-all duration-700 ease-in-out animate-pulse-glow"></div>

      {/* Logs */}
      <div className="absolute bottom-0 w-full h-12 flex justify-center items-end">
        {/* Left Log */}
        <div className="absolute w-24 h-6 bg-amber-900 rounded-full rotate-[20deg] translate-y-2 -translate-x-4 border-b-2 border-black/50 shadow-lg"></div>
        {/* Right Log */}
        <div className="absolute w-24 h-6 bg-amber-900 rounded-full -rotate-[20deg] translate-y-2 translate-x-4 border-b-2 border-black/50 shadow-lg"></div>
        {/* Center Log */}
        <div className="absolute w-20 h-5 bg-amber-950 rounded-full rotate-0 translate-y-4 z-10 shadow-xl"></div>
      </div>

      {/* Flames */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full h-full flex justify-center items-end mix-blend-screen">
        
        {/* Large Back Flame - Red */}
        <div 
          className="absolute bottom-2 w-20 h-28 bg-gradient-to-t from-red-600 to-orange-500 rounded-tl-[80%] rounded-tr-[80%] rounded-bl-[20%] rounded-br-[20%] animate-[flicker_3s_ease-in-out_infinite_alternate]"
          style={{ transformOrigin: 'bottom center' }}
        ></div>

        {/* Middle Flame - Orange */}
        <div 
          className="absolute bottom-2 w-16 h-24 bg-gradient-to-t from-orange-500 to-amber-400 rounded-tl-[70%] rounded-tr-[70%] rounded-bl-[30%] rounded-br-[30%] animate-[flicker_2.2s_ease-in-out_infinite_alternate-reverse]"
          style={{ transformOrigin: 'bottom center', animationDelay: '0.2s' }}
        ></div>

        {/* Front Flame - Yellow/White */}
        <div 
          className="absolute bottom-2 w-10 h-16 bg-gradient-to-t from-amber-300 to-white rounded-full opacity-90 animate-[flicker_1.5s_ease-in-out_infinite_alternate]"
          style={{ transformOrigin: 'bottom center', animationDelay: '0.5s' }}
        ></div>
        
        {/* Sparks emitted from fire - CSS specific for internal fire sparks */}
        <div className="absolute bottom-10 left-8 w-1 h-1 bg-yellow-200 rounded-full animate-ping opacity-75" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute bottom-12 right-10 w-1.5 h-1.5 bg-orange-200 rounded-full animate-ping opacity-75" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>

      </div>
    </div>
  );
};