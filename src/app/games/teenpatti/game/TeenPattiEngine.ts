    // src/app/teenpatti/game/TeenPattiEngine.ts

    import * as PIXI from 'pixi.js';
    import { CardSprite } from './CardSprite';
    import { ChipAnimation } from './ChipAnimation';
    import { gsap } from 'gsap';

    interface GameConfig {
    cardImages: string[][];
    cardBackImages: string[][];
    dealerAvatar?: string;
    tableBackgroundImage?: string;
    colors?: string[];
    }

    interface PotPosition {
    x: number;
    y: number;
    width: number;
    height: number;
    }

    export class TeenPattiEngine {
    private app: PIXI.Application;
    private containers: {
        background: PIXI.Container;
        table: PIXI.Container;
        pots: PIXI.Container;
        coins: PIXI.Container;
        dealer: PIXI.Container;
        effects: PIXI.Container;
    };

    private cards: CardSprite[][] = []; // [potIndex][cardIndex]
    private coinSprites: Map<string, PIXI.Container[]> = new Map();
    private potPositions: PotPosition[] = [];
    private config: GameConfig | null = null;

    constructor(canvasElement: HTMLElement, width: number, height: number) {
        // Initialize PixiJS Application
        this.app = new PIXI.Application({
        width,
        height,
        backgroundColor: 0x1a0f0a,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: true,
        });

        canvasElement.appendChild(this.app.view as HTMLCanvasElement);

        // Setup layered containers (z-index)
        this.containers = {
        background: new PIXI.Container(),
        table: new PIXI.Container(),
        pots: new PIXI.Container(),
        coins: new PIXI.Container(),
        dealer: new PIXI.Container(),
        effects: new PIXI.Container(),
        };

        // Add containers to stage in order
        Object.values(this.containers).forEach((container) => {
        this.app.stage.addChild(container);
        });

    }

    /**
     * Load game assets (background, dealer avatar)
     */
    async loadAssets(config: GameConfig): Promise<void> {
        this.config = config;

        try {
        // Load background image
        if (config.tableBackgroundImage) {
            const bgTexture = await PIXI.Assets.load(config.tableBackgroundImage);
            const bgSprite = new PIXI.Sprite(bgTexture);
            
            // Scale to cover entire screen
            const scaleX = this.app.screen.width / bgTexture.width;
            const scaleY = this.app.screen.height / bgTexture.height;
            const scale = Math.max(scaleX, scaleY);
            
            bgSprite.scale.set(scale);
            bgSprite.position.set(
            (this.app.screen.width - bgTexture.width * scale) / 2,
            (this.app.screen.height - bgTexture.height * scale) / 2
            );
            
            this.containers.background.addChild(bgSprite);
        }

        // Load dealer avatar
        if (config.dealerAvatar) {
            const dealerTexture = await PIXI.Assets.load(config.dealerAvatar);
            const dealerSprite = new PIXI.Sprite(dealerTexture);
            dealerSprite.anchor.set(0.5);
            dealerSprite.width = 180;
            dealerSprite.height = 180;
            dealerSprite.position.set(this.app.screen.width / 2, 180);
            
            // Add circular mask
            const mask = new PIXI.Graphics();
            mask.beginFill(0xffffff);
            mask.drawCircle(this.app.screen.width / 2, 180, 90);
            mask.endFill();
            dealerSprite.mask = mask;
            
            this.containers.dealer.addChild(mask);
            this.containers.dealer.addChild(dealerSprite);
        }

        } catch (error) {
        console.error('❌ [PixiJS] Failed to load assets:', error);
        }
    }

    /**
     * Create 3 betting pots with cards
     */
    createPots(config: GameConfig): void {
        const potWidth = 280;
        const potHeight = 360;
        const gap = 40;
        const startX = (this.app.screen.width - (potWidth * 3 + gap * 2)) / 2;
        const startY = this.app.screen.height / 2 - 20;

        this.cards = [];
        this.potPositions = [];

        for (let potIndex = 0; potIndex < 3; potIndex++) {
        const potX = startX + potIndex * (potWidth + gap) + potWidth / 2;
        const potY = startY + potHeight / 2;

        // Store pot position for coin animations
        this.potPositions.push({
            x: potX,
            y: potY,
            width: potWidth,
            height: potHeight,
        });

        // Create pot background with gradient
        const potBg = new PIXI.Graphics();
        potBg.beginFill(0x6b1f2b, 0.85);
        potBg.drawRoundedRect(
            potX - potWidth / 2,
            potY - potHeight / 2,
            potWidth,
            potHeight,
            20
        );
        potBg.endFill();

        // Add border
        potBg.lineStyle(2, 0xff9966, 0.5);
        potBg.drawRoundedRect(
            potX - potWidth / 2,
            potY - potHeight / 2,
            potWidth,
            potHeight,
            20
        );

        this.containers.pots.addChild(potBg);

        // Create 3 cards for this pot
        const cardPot: CardSprite[] = [];
        const cardGap = 18;
        const cardStartX = potX - 50;

        for (let cardIndex = 0; cardIndex < 3; cardIndex++) {
            const cardX = cardStartX + cardIndex * cardGap;
            const cardY = potY - 40;

            const card = new CardSprite(
            config.cardImages[potIndex][cardIndex],
            config.cardBackImages[potIndex][cardIndex],
            cardX,
            cardY,
            90,
            130
            );

            this.containers.pots.addChild(card.getSprite());
            cardPot.push(card);
        }

        this.cards.push(cardPot);

        // Initialize coin array for this pot
        this.coinSprites.set(`pot${potIndex + 1}`, []);
        }

        // console.log('✅ [PixiJS] Created 3 pots with cards');
    }

    /**
     * Add animated coin to specific pot
     */
    addCoinToPot(
        potName: string,
        amount: number,
        color: string,
        onComplete?: () => void
    ): void {
        const potIndex = parseInt(potName.replace('pot', '')) - 1;
        if (potIndex < 0 || potIndex > 2) {
        console.warn(`⚠️ [PixiJS] Invalid pot name: ${potName}`);
        return;
        }

        const pos = this.potPositions[potIndex];
        const coinContainer = ChipAnimation.animateCoinToPot(
        this.containers.coins,
        amount,
        pos.x,
        pos.y,
        pos.width,
        pos.height,
        color,
        onComplete
        );

        // Store coin reference
        const potCoins = this.coinSprites.get(potName) || [];
        potCoins.push(coinContainer);
        this.coinSprites.set(potName, potCoins);
    }

    /**
     * Flip all cards in all pots with stagger
     */
    async flipAllCards(): Promise<void> {

        for (let potIndex = 0; potIndex < 3; potIndex++) {
        const potCards = this.cards[potIndex];
        
        // Flip cards in this pot with stagger
        await CardSprite.flipMultiple(potCards, 120);
        
        // Small delay between pots
        if (potIndex < 2) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        }

    }

    /**
     * Highlight winning pot with glow animation
     */
    highlightWinningPot(potName: string): void {
        const potIndex = parseInt(potName.replace('pot', '')) - 1;
        if (potIndex < 0 || potIndex > 2) return;

        const pos = this.potPositions[potIndex];

        // Create pulsing glow overlay
        const glow = new PIXI.Graphics();
        glow.beginFill(0x22c55e, 0.4);
        glow.drawRoundedRect(
        pos.x - pos.width / 2 - 15,
        pos.y - pos.height / 2 - 15,
        pos.width + 30,
        pos.height + 30,
        25
        );
        glow.endFill();

        glow.alpha = 0;
        this.containers.effects.addChild(glow);

        // Pulsing animation
        gsap.to(glow, {
        alpha: 0.7,
        duration: 0.5,
        yoyo: true,
        repeat: 5,
        ease: 'power2.inOut',
        onComplete: () => {
            glow.destroy();
        },
        });

        // Add particle burst
        ChipAnimation.createWinParticles(
        this.containers.effects,
        pos.x,
        pos.y,
        0xffd700
        );

        // Add glow to winning cards
        this.cards[potIndex].forEach((card) => {
        card.addGlow(0x22c55e, 8);
        
        // Remove glow after 3 seconds
        setTimeout(() => {
            card.removeGlow();
        }, 3000);
        });

    }

    /**
     * Clear all coins from all pots
     */
    clearAllCoins(): void {
        const allCoins: PIXI.Container[] = [];
        
        this.coinSprites.forEach((coins) => {
        allCoins.push(...coins);
        });

        ChipAnimation.clearCoins(allCoins, () => {
        // Reset coin storage
        this.coinSprites.clear();
        this.coinSprites.set('pot1', []);
        this.coinSprites.set('pot2', []);
        this.coinSprites.set('pot3', []);
        
        // console.log('✅ [PixiJS] All coins cleared');
        });
    }

    /**
     * Reset all cards to back face
     */
    resetCards(): void {
        this.cards.forEach((potCards) => {
        potCards.forEach((card) => {
            card.showBack();
        });
        });

        // console.log('✅ [PixiJS] Cards reset to back face');
    }

    /**
     * Sweep coins to winner position (payout animation)
     */
    sweepCoinsToWinner(potName: string, targetX: number, targetY: number): void {
        const coins = this.coinSprites.get(potName) || [];
        
        ChipAnimation.sweepCoinsToWinner(coins, targetX, targetY, () => {
        this.coinSprites.set(potName, []);
        });
    }

    /**
     * Get pot positions (for external click detection)
     */
    getPotPositions(): PotPosition[] {
        return this.potPositions;
    }

    /**
     * Resize handler
     */
    resize(width: number, height: number): void {
        this.app.renderer.resize(width, height);

        // Recalculate pot positions if needed
        if (this.config) {
        // Could rebuild pots here if necessary
        }
    }

    /**
     * Get app instance
     */
    getApp(): PIXI.Application {
        return this.app;
    }

    /**
     * Destroy engine and cleanup
     */
    destroy(): void {
        // Destroy all cards
        this.cards.forEach((potCards) => {
        potCards.forEach((card) => card.destroy());
        });

        // Destroy all coins
        this.coinSprites.forEach((coins) => {
        coins.forEach((coin) => coin.destroy({ children: true }));
        });

        // Destroy PixiJS app
        this.app.destroy(true, {
        children: true,
        texture: true,
        });

        // console.log('✅ [PixiJS] Engine destroyed');
    }
    }