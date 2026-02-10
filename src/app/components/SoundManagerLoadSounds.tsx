// SoundManagerLoadSounds.tsx
import { useEffect } from 'react';
import { SoundManager } from '../games/teenpatti/game/SoundManager';

const soundFiles = {
    GreedyCoinAnimationAddSound: `/coin_add.wav`,
    GreedyBetClickSound: `/GreedyBetClickSound.wav`,
    GreedyWheelSpinSound: `/GreedyWheelSpinSound.mp3`,
    TimerUpSound: `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/timeUp.mp3`,
    GreedyBackgroundMusic: `/GreedyBackgroundMusic.mp3`,
};

export const SoundManagerLoadSounds = () => {
    useEffect(() => {
        SoundManager.getInstance().loadSounds(soundFiles);
    }
        , []);
    return null;
};

