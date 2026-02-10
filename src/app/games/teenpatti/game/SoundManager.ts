// game/teenpatti/game/SoundManager.ts
export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private unlocked: boolean = false;
  private isWeb: boolean = typeof window !== 'undefined';
  private backgroundKey: string | null = null;
  private backgroundAudio: HTMLAudioElement | null = null;
  private backgroundVolume: number = 0.25;
  private pendingBackgroundMusic: { key: string; volume: number } | null = null;

  private constructor() {
    if (this.isWeb) {
      this.setupAutoUnlock();
      // Multiple unlock strategies
      this.tryMultipleUnlockStrategies();
    }
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Try multiple unlock strategies
   */
  private tryMultipleUnlockStrategies() {
    // Strategy 1: Immediate attempt
    setTimeout(() => this.tryUnlock(), 100);
    
    // Strategy 2: After page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.tryUnlock(), 200);
      });
    } else {
      setTimeout(() => this.tryUnlock(), 200);
    }
    
    // Strategy 3: After visibility change (works when app comes to foreground)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.unlocked) {
        this.tryUnlock();
      }
    });

    // Strategy 4: Listen for any page interaction
    const unlockOnAnyEvent = () => {
      if (!this.unlocked) {
        this.tryUnlock();
      }
    };
    
    // These will catch any interaction
    ['touchstart', 'touchend', 'mousedown', 'click', 'keydown', 'scroll']
      .forEach(event => {
        document.addEventListener(event, unlockOnAnyEvent, { 
          once: true, 
          passive: true 
        });
      });
  }

  /**
   * Try to unlock audio
   */
  private tryUnlock(): boolean {
    if (this.unlocked) return true;

    try {
      // Try to play a very short silent audio
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      
      if (AudioContext) {
        const ctx = new AudioContext();
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        
        // Resume if suspended
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            this.markAsUnlocked();
          }).catch(() => {});
        } else {
          this.markAsUnlocked();
        }
      }

      // Also try HTML5 Audio
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      const playPromise = silentAudio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            silentAudio.pause();
            this.markAsUnlocked();
          })
          .catch(() => {
            // Silently fail, will retry on next interaction
          });
      }

      return this.unlocked;
    } catch (e) {
      return false;
    }
  }

  /**
   * Mark as unlocked and play pending music
   */
  private markAsUnlocked() {
    if (this.unlocked) return;
    
    this.unlocked = true;
    console.log('[SoundManager] ✅ Audio unlocked successfully!');
    
    // Play any pending background music
    if (this.pendingBackgroundMusic) {
      const { key, volume } = this.pendingBackgroundMusic;
      this.pendingBackgroundMusic = null;
      console.log(`[SoundManager] Playing pending background music: ${key}`);
      setTimeout(() => this.playBackground(key, volume), 100);
    }
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
      
      const success = this.tryUnlock();
      
      if (success) {
        // Remove listeners after successful unlock
        ['click', 'touchstart', 'touchend', 'keydown', 'mousedown'].forEach(event => {
          document.removeEventListener(event, unlock);
        });
      }
    };

    // Listen to multiple interaction types
    ['click', 'touchstart', 'touchend', 'keydown', 'mousedown'].forEach(event => {
      document.addEventListener(event, unlock, { passive: true });
    });
  }

  /**
   * Play a sound effect
   */
  play(key: string, volume: number = 0.5) {
    if (!this.enabled) return;

    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`[SoundManager] Sound not found: ${key}`);
      return;
    }

    try {
      const clone = sound.cloneNode(true) as HTMLAudioElement;
      clone.volume = volume;

      const playPromise = clone.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!this.unlocked) this.markAsUnlocked();
          })
          .catch(() => {
            if (!this.unlocked) {
              console.log(`[SoundManager] ⏳ Waiting for unlock to play: ${key}`);
            }
          });
      }
    } catch (err) {
      console.error(`[SoundManager] Failed to play sound ${key}`, err);
    }
  }

  /**
   * Play background music (looped, single instance)
   */
  playBackground(key: string, volume = 0.05) {
    if (!this.enabled) return;

    const sound = this.sounds.get(key);
    if (!sound) {
      console.warn(`[SoundManager] Sound not found: ${key}`);
      return;
    }

    // If already playing the same track, don't restart
    if (this.backgroundAudio && !this.backgroundAudio.paused && this.backgroundKey === key) {
      console.log(`[SoundManager] Background music already playing: ${key}`);
      return;
    }

    // Stop any existing background music
    if (this.backgroundAudio) {
      this.stopBackground();
    }

    const bg = sound.cloneNode(true) as HTMLAudioElement;
    bg.loop = true;
    bg.volume = volume;

    const playPromise = bg.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.backgroundAudio = bg;
          this.backgroundKey = key;
          if (!this.unlocked) this.markAsUnlocked();
          console.log(`[SoundManager] 🎵 Background music playing: ${key} at volume ${volume}`);
        })
        .catch((err) => {
          if (!this.unlocked) {
            console.log(`[SoundManager] ⏳ Background music queued: ${key} (waiting for unlock)`);
            // Save for later
            this.pendingBackgroundMusic = { key, volume };
          } else {
            console.error(`[SoundManager] Failed to play background music:`, err);
          }
        });
    }
  }

  /**
   * Force unlock (call this from a button click or user interaction)
   */
  forceUnlock() {
    console.log('[SoundManager] Forcing unlock...');
    this.tryUnlock();
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
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.currentTime = 0;
    }
  }

  /**
   * Enable/disable all sounds
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
      this.stopBackground();
    }
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Check if audio is unlocked
   */
  isUnlocked(): boolean {
    return this.unlocked;
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
    this.pendingBackgroundMusic = null;
    console.log('[SoundManager] Destroyed');
  }

  stopBackground() {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio.currentTime = 0;
      this.backgroundAudio = null;
      this.backgroundKey = null;
    }
    this.pendingBackgroundMusic = null;
  }

  setBackgroundVolume(volume: number) {
    this.backgroundVolume = Math.max(0, Math.min(1, volume));

    if (this.backgroundAudio) {
      this.backgroundAudio.volume = this.backgroundVolume;
    }
  }
}