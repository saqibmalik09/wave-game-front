// src/app/teenpatti/game/ChipAnimation.ts

import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

export class ChipAnimation {
  /**
   * Create and animate a coin toss from top of pot to random position inside
   */
  static animateCoinToPot(
    container: PIXI.Container,
    amount: number,
    potX: number,
    potY: number,
    potWidth: number,
    potHeight: number,
    color: string,
    onComplete?: () => void
  ): PIXI.Container {
    // Create chip container
    const chipContainer = new PIXI.Container();

    // Create circular chip background with gradient effect
    const chipGraphics = new PIXI.Graphics();
    const chipColor = this.getColorHex(color);

    // Main circle
    chipGraphics.beginFill(chipColor);
    chipGraphics.drawCircle(0, 0, 30);
    chipGraphics.endFill();

    // Outer border (white)
    chipGraphics.lineStyle(3, 0xffffff, 0.8);
    chipGraphics.drawCircle(0, 0, 30);

    // Inner ring for detail
    chipGraphics.lineStyle(2, 0xffffff, 0.4);
    chipGraphics.drawCircle(0, 0, 22);

    // Center dot for decoration
    chipGraphics.beginFill(0xffffff, 0.6);
    chipGraphics.drawCircle(0, 0, 4);
    chipGraphics.endFill();

    chipContainer.addChild(chipGraphics);

    // Create amount text
    const displayAmount = amount >= 1000 ? `${amount / 1000}k` : amount.toString();
    const text = new PIXI.Text(displayAmount, {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: 'bold',
      fill: 0xffffff,
      align: 'center',
      stroke: 0x000000,
    });
    text.anchor.set(0.5);
    chipContainer.addChild(text);

    // Start position (top center of pot)
    const startX = potX;
    const startY = potY - potHeight / 2 - 50;

    // End position (random inside pot, avoiding edges)
    const padding = 70;
    const endX = potX + (Math.random() - 0.5) * (potWidth - padding * 2);
    const endY = potY + potHeight / 4 + (Math.random() - 0.5) * (potHeight / 4);

    // Set initial position and scale
    chipContainer.position.set(startX, startY);
    chipContainer.scale.set(0.4);
    chipContainer.alpha = 0;

    // Add to container
    container.addChild(chipContainer);

    // Create animation timeline
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    // Fade in
    timeline.to(chipContainer, {
      alpha: 1,
      duration: 0.1,
    });

    // Move to position with arc motion
    timeline.to(
      chipContainer,
      {
        x: endX,
        y: endY,
        duration: 0.6,
        ease: 'power2.out',
      },
      0.1
    );

    // Scale up with bounce
    timeline.to(
      chipContainer.scale,
      {
        x: 1,
        y: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
      },
      0.1
    );

    // Rotate slightly for realism
    timeline.to(
      chipContainer,
      {
        rotation: (Math.random() - 0.5) * 0.4,
        duration: 0.6,
        ease: 'power2.out',
      },
      0.1
    );

    // Bounce on landing
    timeline.to(
      chipContainer,
      {
        y: endY - 10,
        duration: 0.15,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      },
      0.7
    );

    return chipContainer;
  }

  /**
   * Clear all coins with fade out animation
   */
  static clearCoins(
    coins: PIXI.Container[],
    onComplete?: () => void
  ): void {
    if (coins.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    let completedCount = 0;

    coins.forEach((coin, index) => {
      gsap.to(coin, {
        alpha: 0,
        scale: 0.3,
        rotation: coin.rotation + Math.PI,
        duration: 0.4,
        delay: index * 0.03,
        ease: 'power2.in',
        onComplete: () => {
          coin.destroy({ children: true });
          completedCount++;

          if (completedCount === coins.length && onComplete) {
            onComplete();
          }
        },
      });
    });
  }

  /**
   * Sweep coins to winner position (for payout animation)
   */
  static sweepCoinsToWinner(
    coins: PIXI.Container[],
    targetX: number,
    targetY: number,
    onComplete?: () => void
  ): void {
    if (coins.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    let completedCount = 0;

    coins.forEach((coin, index) => {
      gsap.to(coin, {
        x: targetX,
        y: targetY,
        scale: 0.5,
        alpha: 0,
        duration: 0.8,
        delay: index * 0.05,
        ease: 'power2.in',
        onComplete: () => {
          coin.destroy({ children: true });
          completedCount++;

          if (completedCount === coins.length && onComplete) {
            onComplete();
          }
        },
      });
    });
  }

  /**
   * Create particle burst effect for winning pot
   */
  static createWinParticles(
    container: PIXI.Container,
    x: number,
    y: number,
    color: number = 0xffd700
  ): void {
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(color);
      particle.drawCircle(0, 0, Math.random() * 4 + 2);
      particle.endFill();

      particle.position.set(x, y);
      container.addChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 50 + Math.random() * 50;
      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;

      gsap.to(particle, {
        x: targetX,
        y: targetY,
        alpha: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => {
          particle.destroy();
        },
      });
    }
  }

  /**
   * Convert color name to hex value
   */
  private static getColorHex(color: string): number {
    const colorMap: { [key: string]: number } = {
      red: 0xff3333,
      green: 0x33ff66,
      blue: 0x3366ff,
      yellow: 0xffcc00,
      purple: 0x9933ff,
      orange: 0xff9933,
      black: 0x333333,
      white: 0xeeeeee,
      gold: 0xffd700,
      pink: 0xff69b4,
      cyan: 0x00ffff,
    };

    return colorMap[color.toLowerCase()] || 0xff3333;
  }

  /**
   * Create pulsing glow animation for coin
   */
  static addPulseGlow(coin: PIXI.Container): gsap.core.Tween {
    return gsap.to(coin, {
      alpha: 0.7,
      duration: 0.8,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Stack coins in a neat pile (for pot display)
   */
  static stackCoins(
    coins: PIXI.Container[],
    centerX: number,
    centerY: number,
    maxRadius: number = 60
  ): void {
    coins.forEach((coin, index) => {
      const angle = (index / coins.length) * Math.PI * 2;
      const radius = Math.random() * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      gsap.to(coin, {
        x,
        y,
        duration: 0.5,
        delay: index * 0.05,
        ease: 'back.out(1.7)',
      });
    });
  }
}