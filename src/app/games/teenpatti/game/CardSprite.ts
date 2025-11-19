import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { GlowFilter } from '@pixi/filter-glow';

export class CardSprite {
  private sprite: PIXI.Sprite;
  private frontTexture: PIXI.Texture;
  private backTexture: PIXI.Texture;
  private isFaceUp: boolean = false;

  constructor(
    frontImageUrl: string,
    backImageUrl: string,
    x: number,
    y: number,
    width: number = 90,
    height: number = 130
  ) {
    this.frontTexture = PIXI.Texture.from(frontImageUrl);
    this.backTexture = PIXI.Texture.from(backImageUrl);

    this.sprite = new PIXI.Sprite(this.backTexture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(x, y);
    this.sprite.width = width;
    this.sprite.height = height;

    // Cast to PIXI.Filter[] to satisfy TypeScript
    this.sprite.filters = [
      new DropShadowFilter({
        color: 0x000000,
        alpha: 0.5,
        blur: 4,
        distance: 3,
      }) as unknown as PIXI.Filter,
    ];
  }

  async flip(duration: number = 400): Promise<void> {
    return new Promise((resolve) => {
      const timeline = gsap.timeline();
      timeline.to(this.sprite.scale, {
        x: 0,
        duration: duration / 1000 / 2,
        ease: 'power2.in',
        onComplete: () => {
          this.sprite.texture = this.isFaceUp ? this.backTexture : this.frontTexture;
          this.isFaceUp = !this.isFaceUp;
        },
      });
      timeline.to(this.sprite.scale, {
        x: 1,
        duration: duration / 1000 / 2,
        ease: 'power2.out',
        onComplete: resolve,
      });
      timeline.to(
        this.sprite,
        { y: this.sprite.y - 10, duration: duration / 1000 / 2, ease: 'power2.out', yoyo: true, repeat: 1 },
        0
      );
    });
  }

  static async flipMultiple(cards: CardSprite[], staggerDelay: number = 100): Promise<void> {
    const promises = cards.map((card, i) => new Promise<void>((res) => setTimeout(() => card.flip().then(res), i * staggerDelay)));
    await Promise.all(promises);
  }

  showFront() { this.sprite.texture = this.frontTexture; this.isFaceUp = true; }
  showBack() { this.sprite.texture = this.backTexture; this.isFaceUp = false; }
  isFaceUpCheck(): boolean { return this.isFaceUp; }
  setPosition(x: number, y: number) { this.sprite.position.set(x, y); }
  getPosition(): { x: number; y: number } { return { x: this.sprite.x, y: this.sprite.y }; }
  setSize(width: number, height: number) { this.sprite.width = width; this.sprite.height = height; }

  addGlow(color: number = 0x22c55e, strength: number = 10) {
    const glow = new GlowFilter({ color, outerStrength: strength, innerStrength: 0 }) as unknown as PIXI.Filter;
    this.sprite.filters = [...(this.sprite.filters || []), glow];
  }

  removeGlow() {
    this.sprite.filters = (this.sprite.filters || []).filter(f => !(f instanceof GlowFilter)) as PIXI.Filter[];
  }

  async fadeIn(duration: number = 500) {
    return new Promise<void>((resolve) => gsap.to(this.sprite, { alpha: 1, duration: duration / 1000, ease: 'power2.out', onComplete: resolve }));
  }

  async fadeOut(duration: number = 500) {
    return new Promise<void>((resolve) => gsap.to(this.sprite, { alpha: 0, duration: duration / 1000, ease: 'power2.in', onComplete: resolve }));
  }

  getSprite(): PIXI.Sprite { return this.sprite; }

  destroy() {
    if (this.sprite) this.sprite.destroy({ texture: false });
  }
}
