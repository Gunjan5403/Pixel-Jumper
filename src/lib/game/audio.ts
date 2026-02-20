import * as Tone from 'tone';

let synth: Tone.Synth | null = null;
let metalSynth: Tone.MetalSynth | null = null;

export const initAudio = async () => {
    // Check if Tone.js has already been started
    if (Tone.context.state !== 'running') {
        // This must be called in response to a user gesture (e.g., a click)
        await Tone.start();
    }

    if (!synth) {
        synth = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.1 },
        }).toDestination();
    }
    
    if (!metalSynth) {
        metalSynth = new Tone.MetalSynth({
            frequency: 150,
            envelope: { attack: 0.001, decay: 0.1, release: 0.05 },
            harmonicity: 3.1,
            modulationIndex: 16,
            resonance: 3000,
            octaves: 1.5,
        }).toDestination();
    }
};

export const playJumpSound = () => {
    synth?.triggerAttackRelease('C5', '16n', Tone.now());
};

export const playCoinSound = () => {
    // A quick, high-pitched sound
    if (synth) {
      synth.triggerAttackRelease('E6', '32n', Tone.now());
    }
};

export const playEnemyDefeatSound = () => {
    // A crunchy, metallic sound
    metalSynth?.triggerAttackRelease('C2', '8n', Tone.now(), 0.8);
};

export const playHitSound = () => {
    // A low, dissonant sound for taking damage
    if (synth) {
        synth.triggerAttackRelease('G#2', '8n', Tone.now());
    }
};
