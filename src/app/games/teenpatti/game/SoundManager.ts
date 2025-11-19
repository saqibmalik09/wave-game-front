// game/teenpatti/game/SoundManager.ts
export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  private constructor() {}

  /**
   * Singleton instance
   */
  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Load sounds from game configuration
   * Example keys: timerUpSound, cardsShuffleSound, betButtonAndCardClickSound
   */
  loadSounds(soundUrls: { [key: string]: string }): void {
    Object.entries(soundUrls).forEach(([key, url]) => {
      if (!url) return;
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = 0.5;
        this.sounds.set(key, audio);
      } catch (error) {
        console.error(`❌ [SoundManager] Failed to load sound: ${key}`, error);
      }
    });
  }

  /**
   * Play a sound by key
   */
  play(key: string): void {
    if (!this.enabled) return;
    const sound = this.sounds.get(key);
    if (sound) {
      const clone = sound.cloneNode(true) as HTMLAudioElement;
      clone.volume = 0.5;
      clone.play().catch((err) => console.warn(`⚠️ [SoundManager] Failed to play ${key}`, err));
    } else {
      console.warn(`⚠️ [SoundManager] Sound not found: ${key}`);
    }
  }

  /**
   * Stop a specific sound
   */
  stop(key: string): void {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Stop all sounds
   */
  stopAll(): void {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Enable / disable all sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stopAll();
  }

  /**
   * Check if sound is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Cleanup all sounds
   */
  destroy(): void {
    this.stopAll();
    this.sounds.forEach((sound) => (sound.src = ''));
    this.sounds.clear();
    console.log('🧹 [SoundManager] Destroyed');
  }
}
