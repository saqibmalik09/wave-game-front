// game/teenpatti/game/SoundManager.ts
export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private unlocked: boolean = false; // for browser autoplay restriction
  private isWeb: boolean = typeof window !== 'undefined';

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Load sounds from URLs
   */
  loadSounds(soundUrls: { [key: string]: string }): void {
    Object.entries(soundUrls).forEach(([key, url]) => {
      if (!url) return;
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = 0.5;
        this.sounds.set(key, audio);
      } catch (err) {
        console.error(`❌ [SoundManager] Failed to load sound: ${key}`, err);
      }
    });

    if (this.isWeb) {
      this.unlockAudioOnInteraction();
    }
  }

  /**
   * Unlock audio in browser (play/pause once) after first user interaction
   */
  private unlockAudioOnInteraction() {
    if (this.unlocked) return;

    const unlock = () => {
      this.sounds.forEach((sound) => {
        const clone = sound.cloneNode(true) as HTMLAudioElement;
        clone.play().catch(() => {});
        clone.pause();
        clone.currentTime = 0;
      });
      this.unlocked = true;
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      console.log('✅ [SoundManager] Audio unlocked');
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  /**
   * Play a sound
   */
  play(key: string, volume: number = 0.5) {
    if (!this.enabled) return;

    const sound = this.sounds.get(key);
    if (!sound) return console.warn(`⚠️ [SoundManager] Sound not found: ${key}`);

    try {
      const clone = sound.cloneNode(true) as HTMLAudioElement;
      clone.volume = volume;
      clone.play().catch((err) => {
        if (this.isWeb && !this.unlocked) {
          console.warn(`⚠️ [SoundManager] Cannot autoplay ${key} before interaction`, err);
        }
      });
    } catch (err) {
      console.error(`❌ [SoundManager] Failed to play sound ${key}`, err);
    }
  }

  stop(key: string) {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  stopAll() {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.stopAll();
  }

  isEnabled() {
    return this.enabled;
  }

  destroy() {
    this.stopAll();
    this.sounds.forEach((s) => (s.src = ''));
    this.sounds.clear();
    console.log('🧹 [SoundManager] Destroyed');
  }
}
