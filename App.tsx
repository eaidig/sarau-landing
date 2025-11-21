import React, { useState, useEffect } from 'react';
import { Campfire } from './components/Campfire';
import { Particles } from './components/Particles';
import { GlassButton } from './components/GlassButton';
import { PixelHeader } from './components/PixelHeader';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b] text-white selection:bg-sarau/30">
      {/* Global Animation Styles */}
      <style>{`
        @keyframes rise {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(15px); }
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          25% { transform: scale(1.05) rotate(1deg); opacity: 1; }
          50% { transform: scale(0.98) rotate(-1deg); opacity: 0.8; }
          75% { transform: scale(1.02); opacity: 0.95; }
        }
      `}</style>

      {/* 8-Bit Interactive Header */}
      <PixelHeader />

      <div className="relative w-full min-h-[calc(100vh-300px)] flex flex-col">
        {/* Background Particles Layer */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Particles count={25} type="spark" />
          <Particles count={8} type="note" />
        </div>

        {/* Main Content Container */}
        <div 
          className={`relative z-10 flex flex-col items-center justify-between flex-grow px-4 py-8 transition-opacity duration-1000 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          
          {/* Header Section */}
          <header className="text-center mt-8 md:mt-12 max-w-4xl mx-auto space-y-2">
            {/* Simulated Logo using Typography and Brand Green */}
            <h1 className="font-handwriting text-7xl md:text-9xl text-sarau drop-shadow-[0_0_25px_rgba(63,171,90,0.4)] animate-float pb-2 leading-[0.8]">
              Sarau <br className="md:hidden" />
              <span className="text-sarau-light">ao Natural</span>
            </h1>
            <p className="font-sans text-lg md:text-2xl text-blue-100/80 font-light tracking-wide leading-relaxed drop-shadow-md pt-4">
              A arte respira aqui. <br className="hidden md:block" />
              <span className="text-white font-normal">Inscreva-se e faça parte da nossa história.</span>
            </p>
          </header>

          {/* Action Section - Grid Layout for Desktop */}
          <main className="w-full max-w-5xl mx-auto mt-8 md:mt-12 mb-20 z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
              
              {/* Artist Column */}
              <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-gradient-to-b from-amber-900/10 to-transparent border border-amber-900/20 backdrop-blur-sm">
                <div className="text-center space-y-2 mb-2">
                  <span className="text-4xl">🎨</span>
                  <h2 className="font-handwriting text-3xl text-ember-light">Para Artistas</h2>
                  <p className="font-sans text-sm text-gray-300 leading-relaxed max-w-xs mx-auto">
                    Música, Poesia, Teatro, Performance. <br/>
                    Se você quer subir no palco, apresentar seu talento e compartilhar sua arte.
                  </p>
                </div>
                <GlassButton 
                  variant="ember" 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSf_scIbk41ISXkwvU4K25msQ1F18vukadyW8sH7dFGU2ezc7A/viewform"
                >
                  Inscrição para Artistas
                </GlassButton>
              </div>

              {/* Exhibitor Column */}
              <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl bg-gradient-to-b from-sarau-dark/10 to-transparent border border-sarau-dark/20 backdrop-blur-sm">
                <div className="text-center space-y-2 mb-2">
                  <span className="text-4xl">🛍️</span>
                  <h2 className="font-handwriting text-3xl text-sarau-light">Para Expositores</h2>
                  <p className="font-sans text-sm text-gray-300 leading-relaxed max-w-xs mx-auto">
                    Artesanato, Gastronomia, Produtos Criativos. <br/>
                    Monte seu stand, exponha e venda seu trabalho.
                  </p>
                </div>
                <GlassButton 
                  variant="nature"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdvd9jxZVE3J76r0s2v02NItW7WZ2gncHkYFsgm9gcqiGFYfg/viewform"
                >
                  Inscrição para Expositores
                </GlassButton>
              </div>

            </div>
          </main>

          {/* Footer & Campfire Anchoring */}
          <footer className="w-full flex flex-col items-center justify-end relative h-48 md:h-60 shrink-0">
            
            {/* Campfire Container - Centered visually */}
            <div className="absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 scale-75 md:scale-100 z-0">
              <Campfire />
            </div>

            <div className="z-10 text-center mt-auto pb-4">
              <p className="font-sans text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em] hover:text-white/50 transition-colors">
                © 2025 - Site criado e hospedado com amor por <a href="https://pigorproducoes.com.br" target="_blank" rel="noopener noreferrer" className="text-sarau-light hover:text-sarau hover:underline font-bold transition-colors">Pigor Produções</a> 💚
              </p>
            </div>
          </footer>
        </div>

        {/* Subtle Overlay Vignette for main content only */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/60 z-20"></div>
      </div>
    </div>
  );
};

export default App;