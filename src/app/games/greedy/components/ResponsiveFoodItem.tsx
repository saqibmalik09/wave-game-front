// ResponsiveFoodItem.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

interface FoodItemProps {
  imageUrl: string;
  multiplier: string;
  imageScale?: number;
}

const ResponsiveFoodItem: React.FC<FoodItemProps> = ({ 
  imageUrl, 
  multiplier,
  imageScale = 0.34 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const isInitializing = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isInitializing.current) return;

    let destroyed = false;
    isInitializing.current = true;

    const initApp = async () => {
      try {
        // Calculate responsive size
        const getOptimalSize = () => {
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const minDimension = Math.min(screenWidth, screenHeight);
          
          // Adaptive sizing based on screen
          if (minDimension < 400) return 280;
          if (minDimension < 600) return 320;
          if (minDimension < 800) return 350;
          if (minDimension < 1200) return 380;
          return 400;
        };

        const canvasSize = getOptimalSize();
        const app = new PIXI.Application();
        
        await app.init({
          width: canvasSize,
          height: canvasSize,
          backgroundAlpha: 0,
          antialias: true,
          resolution: window.devicePixelRatio || 2,
          autoDensity: true,
        });

        if (destroyed) {
          app.destroy(true, { children: true, texture: true });
          return;
        }

        appRef.current = app;
        containerRef.current?.appendChild(app.canvas);

        const root = new PIXI.Container();
        app.stage.addChild(root);
        
        // Responsive scaling
        const baseScale = canvasSize / 1250;
        root.x = canvasSize / 2;
        root.y = canvasSize / 2;
        root.scale.set(baseScale);

        // 1. OUTER BORDER
        const outerBorder = new PIXI.Graphics()
          .circle(0, 0, 108)
          .stroke({ color: 0x9e5400, width: 12, alignment: 1 })
          .fill({ color: 0x000000, alpha: 0.1 });
        root.addChild(outerBorder);

        // 2. MAIN GRADIENT BACKGROUND
        const podBg = new PIXI.Graphics()
          .circle(0, 0, 100)
          .fill({ color: 0xFFCC00 });
        
        const podBottomShadow = new PIXI.Graphics()
          .arc(0, 0, 100, 0, Math.PI)
          .fill({ color: 0xFF8800 });
        
        const mask = new PIXI.Graphics().circle(0, 0, 100).fill(0xffffff);
        podBottomShadow.mask = mask;
        
        root.addChild(podBg);
        root.addChild(mask);
        root.addChild(podBottomShadow);

        // 3. WAVY LIQUID FLOOR
        const wave = new PIXI.Graphics();
        wave.mask = mask;
        root.addChild(wave);

        // 4. FOOD ITEM
        const foodTexture = await PIXI.Assets.load(imageUrl);
        
        if (destroyed) return;

        const foodSprite = new PIXI.Sprite(foodTexture);
        foodSprite.anchor.set(0.5);
        foodSprite.scale.set(imageScale);
        foodSprite.y = -6;

        const foodShadow = new PIXI.Graphics()
          .ellipse(0, 45, 30, 8)
          .fill({ color: 0x000000, alpha: 0.2 });
        
        root.addChild(foodShadow);
        root.addChild(foodSprite);

        // 5. MULTIPLIER BADGE
        const badge = new PIXI.Container();
        badge.position.set(95, -100);
        badge.scale.set(1.35);
        root.addChild(badge);

        const badgeBg = new PIXI.Graphics()
          .roundRect(-40, -24, 80, 48, 24)
          .fill({ color: 0xFF4400 })
          .stroke({ color: 0xFFFFFF, width: 4 });
        badge.addChild(badgeBg);

        const badgeText = new PIXI.Text({
          text: multiplier,
          style: {
            fontFamily: 'Arial Black, sans-serif',
            fontSize: 27,
            fill: 0xFFFFFF,
            fontWeight: '900',
            stroke: { color: 0x880000, width: 2 }
          }
        });
        badgeText.anchor.set(0.5);
        badge.addChild(badgeText);

        // Mark as ready
        setIsReady(true);

        // 6. ANIMATION
        let elapsed = 0;
        app.ticker.add((ticker) => {
          const delta = ticker.deltaTime;
          elapsed += delta * 0.06;

          // Wave movement
          wave.clear();
          wave.moveTo(-110, 40);
          for (let i = -110; i <= 110; i += 10) {
            const waveY = 40 + Math.sin(elapsed + i * 0.04) * 6;
            wave.lineTo(i, waveY);
          }
          wave.lineTo(110, 110);
          wave.lineTo(-110, 110);
          wave.fill({ color: 0xFFFFFF, alpha: 0.9 });

          // Food item animation
          foodSprite.y = -10 + Math.cos(elapsed * 0.8) * 4;
          foodSprite.rotation = Math.sin(elapsed * 0.2) * 0.05;
          foodShadow.scale.set(1 + Math.cos(elapsed * 0.8) * 0.1);
          foodShadow.alpha = 0.2 - Math.abs(Math.cos(elapsed * 0.8)) * 0.05;

          // Badge pulse
          const baseBadgeScale = 1.6;
          badge.scale.set(baseBadgeScale + Math.sin(elapsed * 1.5) * 0.06);
        });

        // Handle window resize
        const handleResize = () => {
          const newSize = getOptimalSize();
          app.renderer.resize(newSize, newSize);
          const newScale = newSize / 1250;
          root.x = newSize / 2;
          root.y = newSize / 2;
          root.scale.set(newScale);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup resize listener
        return () => {
          window.removeEventListener('resize', handleResize);
        };

      } catch (err) {
        console.error("PixiJS Init Error:", err);
        setIsReady(true); // Show even on error to prevent infinite loading
      } finally {
        isInitializing.current = false;
      }
    };

    initApp();

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
      isInitializing.current = false;
    };
  }, [imageUrl, multiplier, imageScale]);

  return (
    <div 
      ref={containerRef} 
      className={`drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-opacity duration-300 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        touchAction: 'none',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
};

export default ResponsiveFoodItem;