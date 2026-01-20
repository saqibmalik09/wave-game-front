
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const Strawberry: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!containerRef.current || isInitializing.current) return;

    let destroyed = false;
    isInitializing.current = true;

    const initApp = async () => {
      try {
        const app = new PIXI.Application();
        
        // Initialize with high quality settings
        await app.init({
          width: 350,
          height: 350,
          backgroundAlpha: 0,
          antialias: true,
          resolution: window.devicePixelRatio || 2,
        });

        if (destroyed) {
          app.destroy(true, { children: true, texture: true });
          return;
        }

        appRef.current = app;
        containerRef.current?.appendChild(app.canvas);

        const root = new PIXI.Container();
        app.stage.addChild(root);
        root.x = 115;
        root.y = 115;
        root.scale.set(0.28);//whole component

        // 1. OUTER STROKE / BORDER (The Golden Ring)
        const outerBorder = new PIXI.Graphics()
          .circle(0, 0, 108)
          .stroke({ color: 0x9e5400, width: 12, alignment: 1 })
          .fill({ color: 0x000000, alpha: 0.1 }); // Subtle shadow
        root.addChild(outerBorder);

        // 2. MAIN GRADIENT BACKGROUND
        // We simulate the gradient by layering a few circles
        const podBg = new PIXI.Graphics()
          .circle(0, 0, 100)
          .fill({ color: 0xFFCC00 }); // Main Yellow
        
        const podBottomShadow = new PIXI.Graphics()
          .arc(0, 0, 100, 0, Math.PI)
          .fill({ color: 0xFF8800 }); // Bottom Orange
        
        const mask = new PIXI.Graphics().circle(0, 0, 100).fill(0xffffff);
        podBottomShadow.mask = mask;
        
        root.addChild(podBg);
        root.addChild(mask);
        root.addChild(podBottomShadow);

        // 3. WAVY LIQUID FLOOR (The white wave at the bottom)
        const wave = new PIXI.Graphics();
        wave.mask = mask;
        root.addChild(wave);

        // 4. THE Strawberry (Stylized Game Icon)
        // Using a clear, high-res stylized cartoon Strawberry
        const strawberryTexture = await PIXI.Assets.load('https://cdn-icons-png.flaticon.com/512/590/590772.png');
        
        if (destroyed) return;

            const strawberry = new PIXI.Sprite(strawberryTexture);
            strawberry.anchor.set(0.5); // Center the anchor point
            strawberry.scale.set(0.32); // Adjust scale for better fit
            strawberry.y = -6; // Slightly adjust vertical position
        
        // Subtle drop shadow for the strawberry itself
        const strawberryShadow = new PIXI.Graphics()
          .ellipse(0, 45, 30, 8)
          .fill({ color: 0x000000, alpha: 0.2 });
        
        root.addChild(strawberryShadow);
        root.addChild(strawberry);

        // 5. MULTIPLIER BADGE (The "x5" bubble)
        const badge = new PIXI.Container();
        badge.position.set(95, -100); // moved up
        badge.scale.set(1.35);       // made larger
        root.addChild(badge);

        const badgeBg = new PIXI.Graphics()
        .roundRect(-40, -24, 80, 48, 24)
        .fill({ color: 0xFF4400 })
        .stroke({ color: 0xFFFFFF, width: 4 });
        badge.addChild(badgeBg);

        const badgeText = new PIXI.Text({
        text: 'x8',
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
          wave.lineTo(-110, 110); // Bottom line of the wave
          wave.fill({ color: 0xFFFFFF, alpha: 0.9 });// Float animation for the entire pod

          // Float animation for the entire pod
          root.y = 177 ; //top to bottom float
        // Float animation (Y + X sway)
          root.x = 175 ;
        //   root.y = 175 + Math.sin(elapsed * 0.3) * 8; //top to bottom float and circulation of whole
        //   root.x = 175 + Math.cos(elapsed * 0.3) * 8;

          
          // Hover for the strawberry
          strawberry.y = -10 + Math.cos(elapsed * 0.8) * 4; //up down
          strawberry.rotation = Math.sin(elapsed * 0.2) * 0.05; //tilt
          strawberryShadow.scale.set(1 + Math.cos(elapsed * 0.8) * 0.1); //shadow size
          strawberryShadow.alpha = 0.2 - Math.abs(Math.cos(elapsed * 0.8)) * 0.05;

          // Badge pulse
          const baseBadgeScale = 1.6;
            badge.scale.set( baseBadgeScale + Math.sin(elapsed * 1.5) * 0.06
            );

        });

      } catch (err) {
        console.error("PixiJS Init Error:", err);
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
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
      style={{ touchAction: 'none' }}
    />
  );
};

export default Strawberry;
