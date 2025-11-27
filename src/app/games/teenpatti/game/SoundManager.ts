// game/teenpatti/game/SoundManager.ts
export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private unlocked: boolean = false;
  private isWeb: boolean = typeof window !== 'undefined';

  private constructor() {
    if (this.isWeb) {
      this.setupAutoUnlock();
    }
  }

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
        console.error(`[SoundManager] Failed to load sound: ${key}`, err);
      }
    });
  }

  /**
   * Setup auto unlock on any user interaction
   */
  private setupAutoUnlock() {
    const unlock = () => {
      if (this.unlocked) return;

      // Play and immediately pause all sounds to unlock
      this.sounds.forEach((sound) => {
        sound.play()
          .then(() => {
            sound.pause();
            sound.currentTime = 0;
          })
          .catch(() => {}); // Ignore errors during unlock
      });

      this.unlocked = true;
      console.log('[SoundManager] Audio unlocked');
      
      // Remove listeners after first successful unlock
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };

    // Listen to multiple interaction types
    document.addEventListener('click', unlock);
    document.addEventListener('touchstart', unlock);
    document.addEventListener('keydown', unlock);
  }

  /**
   * Play a sound
   */
  play(key: string, volume: number = 0.5) {
    if (!this.enabled) return;

    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`[SoundManager] Sound not found: ${key}`);
      return;
    }

    try {
      // Clone the sound to allow overlapping plays
      const clone = sound.cloneNode(true) as HTMLAudioElement;
      clone.volume = volume;
      
      const playPromise = clone.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Only warn if audio is still locked
          if (!this.unlocked) {
            console.warn(`[SoundManager] Audio not unlocked yet for ${key}`);
          }
        });
      }
    } catch (err) {
      console.error(`[SoundManager] Failed to play sound ${key}`, err);
    }
  }

  /**
   * Stop a specific sound
   */
  stop(key: string) {
    const sound = this.sounds.get(key);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Enable/disable all sounds
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Toggle sound on/off
   */
  toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopAll();
    this.sounds.forEach((sound) => {
      sound.src = '';
    });
    this.sounds.clear();
    this.unlocked = false;
    console.log('[SoundManager] Destroyed');
  }
}