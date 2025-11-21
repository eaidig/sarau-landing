import React, { useEffect, useRef, useCallback } from 'react';

export const PixelHeader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Definição da Escala Musical (Dó Maior) e Cores
  const SCALES = [
    { note: 261.63, color: '#ef4444', label: 'Dó', key: '1' }, // Vermelho
    { note: 293.66, color: '#f97316', label: 'Ré', key: '2' }, // Laranja
    { note: 329.63, color: '#eab308', label: 'Mi', key: '3' }, // Amarelo
    { note: 349.23, color: '#22c55e', label: 'Fá', key: '4' }, // Verde
    { note: 392.00, color: '#06b6d4', label: 'Sol', key: '5' }, // Ciano
    { note: 440.00, color: '#3b82f6', label: 'Lá', key: '6' }, // Azul
    { note: 493.88, color: '#a855f7', label: 'Si', key: '7' }, // Roxo
  ];

  // Estado do jogo mantido em Ref para acesso dentro do Loop de Animação
  const gameState = useRef({
    musicians: SCALES.map(s => ({
      x: 0,
      y: 260,
      vy: 0,
      ...s
    })),
    fireIntensity: 1.0, // 1.0 é o normal, aumenta quando toca nota
  });

  // Sintetizador de Áudio
  const playNote = (frequency: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square'; // Som 8-bit (Chiptune)
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    // Envelope do som (ADSR simples)
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  // Ação de Pular/Tocar
  const triggerMusician = useCallback((index: number) => {
    const GROUND_Y = 260; 
    const m = gameState.current.musicians[index];
    
    if (m && m.y >= GROUND_Y - 5) {
      m.vy = -8; // Força do pulo
      playNote(m.note);
      
      // Aumenta o fogo!
      // Adiciona intensidade, limitando a um máximo de 5x
      gameState.current.fireIntensity = Math.min(gameState.current.fireIntensity + 1.5, 5.0);
    }
  }, []);

  // Handler de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const index = parseInt(key) - 1; // 1 vira 0, 7 vira 6
      if (index >= 0 && index < 7) {
        triggerMusician(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerMusician]);

  // Handler de Clique no Canvas
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    // Ajuste de escala caso o canvas visual seja diferente do renderizado
    const scaleX = canvas.width / rect.width;
    const clickX = (e.clientX - rect.left) * scaleX;
    
    gameState.current.musicians.forEach((m, index) => {
      // Hitbox de 40px
      if (Math.abs(clickX - m.x) < 25) { 
        triggerMusician(index);
      }
    });
  };

  // Loop de Renderização
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingEnabled = false;
    
    let animationId: number;
    
    // Gerar estrelas estáticas apenas uma vez
    const stars: any[] = [];
    for(let i=0; i<80; i++) {
        stars.push({
            x: Math.random() * window.innerWidth, 
            y: Math.random() * 200, 
            alpha: Math.random(),
            twinkleSpeed: 0.01 + Math.random() * 0.05
        });
    }
    
    let fireParticles: any[] = [];

    const render = () => {
        if (!canvas) return;
        
        // Redimensionamento responsivo do canvas
        const parent = canvas.parentElement;
        if (parent && canvas.width !== parent.clientWidth) {
            canvas.width = parent.clientWidth;
        }
        
        const width = canvas.width;
        const height = canvas.height; // Fixo em 300
        const centerX = width / 2;
        const GROUND_Y = height - 40;

        // Decaimento da intensidade do fogo
        if (gameState.current.fireIntensity > 1.0) {
            gameState.current.fireIntensity *= 0.98; // Diminui 2% por frame
        } else {
            gameState.current.fireIntensity = 1.0;
        }
        const fireScale = gameState.current.fireIntensity;

        // Calcular espaçamento responsivo
        const maxGap = 50; 
        const minGap = 30; 
        let gap = width / 9; 
        if (gap > maxGap) gap = maxGap;
        if (gap < minGap) gap = minGap;

        // Posicionar músicos
        gameState.current.musicians.forEach((m, idx) => {
            const offset = (idx - 3) * gap;
            m.x = centerX + offset;
        });

        // --- DESENHO ---

        // 1. Céu
        ctx.fillStyle = '#0f0518';
        ctx.fillRect(0, 0, width, height);

        // 2. Lua
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(width - 80, 40, 24, 24); 
        ctx.fillStyle = '#0f0518';
        ctx.fillRect(width - 72, 48, 8, 8);

        // 3. Estrelas
        stars.forEach(s => {
            ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
            if (s.x > width) s.x = Math.random() * width;
            ctx.fillRect(s.x, s.y, 2, 2);
            s.alpha += s.twinkleSpeed;
            if (s.alpha > 1 || s.alpha < 0) s.twinkleSpeed *= -1;
        });

        // 4. Chão
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, GROUND_Y + 24, width, height);
        ctx.fillStyle = '#3fab5a'; 
        ctx.fillRect(0, GROUND_Y + 24, width, 6);

        // 5. Fogueira (Dinâmica)
        const fireX = centerX;
        const fireY = GROUND_Y + 20;
        
        // Lenha
        ctx.fillStyle = '#78350f';
        ctx.fillRect(fireX - 25, fireY, 50, 10);

        // Gerar Partículas de Fogo baseado na Intensidade
        // Quanto maior fireScale, maior a chance de gerar partículas
        if (Math.random() < 0.3 * fireScale) {
            fireParticles.push({
                x: fireX + (Math.random() * 30 - 15) * fireScale, // Espalha mais se intenso
                y: fireY, 
                life: 1,
                vx: (Math.random() - 0.5) * 3 * Math.sqrt(fireScale),
                vy: -2.5 * Math.sqrt(fireScale) // Sobe mais rápido se intenso
            });
        }

        fireParticles.forEach((p, i) => {
            p.y += p.vy;
            p.x += p.vx;
            p.life -= 0.04 / Math.sqrt(fireScale); // Dura mais se intenso
            
            if (p.life <= 0) fireParticles.splice(i, 1);
            else {
                ctx.fillStyle = p.life > 0.6 ? '#ef4444' : '#fbbf24';
                const pSize = Math.max(1, p.life * 6 * fireScale); // Tamanho escala com intensidade
                ctx.fillRect(p.x, p.y, pSize, pSize);
            }
        });

        // 6. Músicos
        gameState.current.musicians.forEach((m, i) => {
            // Física
            m.y += m.vy;
            if (m.y < GROUND_Y) {
                m.vy += 0.5; 
            } else {
                m.y = GROUND_Y;
                m.vy = 0;
            }

            const size = 20; 
            const pX = m.x - size/2;
            const pY = m.y - size;

            // Corpo
            ctx.fillStyle = m.color;
            ctx.fillRect(pX, pY, size, size);
            
            // Direção do olhar (olha para a fogueira)
            const lookDir = i < 3 ? 2 : (i > 3 ? -2 : 0); 
            
            // Rosto Feliz (Happy Face)
            ctx.fillStyle = '#000000'; // Preto para contraste ou branco dependendo da cor? Vamos usar preto.
            if (m.key === '7' || m.key === '1' || m.key === '6') ctx.fillStyle = '#ffffff'; // Ajuste contraste para cores escuras
            
            // Olhos
            ctx.fillRect(pX + 4 + lookDir, pY + 6, 2, 2);
            ctx.fillRect(pX + 14 + lookDir, pY + 6, 2, 2);

            // Sorriso
            // Canto esquerdo
            ctx.fillRect(pX + 4 + lookDir, pY + 12, 2, 2);
            // Canto direito
            ctx.fillRect(pX + 14 + lookDir, pY + 12, 2, 2);
            // Fundo
            ctx.fillRect(pX + 6 + lookDir, pY + 14, 8, 2);

            // Sombra
            if (m.y < GROUND_Y) {
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                const shadowScale = 1 - (GROUND_Y - m.y) / 100;
                if (shadowScale > 0) {
                    ctx.fillRect(m.x - 8 * shadowScale, GROUND_Y + 26, 16 * shadowScale, 4);
                }
            }
            
            // Label
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(m.key, m.x, GROUND_Y + 40);
        });

        // 7. Texto de Ajuda
        ctx.fillStyle = '#3fab5a';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CLIQUE OU TECLE 1-7', centerX, 20);

        animationId = requestAnimationFrame(render);
    };
    
    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="w-full bg-[#0f0518] border-b-4 border-[#3fab5a] relative select-none">
        <canvas 
            ref={canvasRef} 
            className="w-full h-[300px] cursor-pointer touch-manipulation block"
            onClick={handleCanvasClick}
            height={300}
        />
    </div>
  );
};