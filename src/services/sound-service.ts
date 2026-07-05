const AudioContextClass =
  typeof window !== "undefined"
    ? window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    : null;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!AudioContextClass) return null;
  if (!audioContext) {
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, gainValue = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(gainValue, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export const soundService = {
  playBell: () => {
    playTone(880, 0.3, 0.2);
    setTimeout(() => playTone(1320, 0.5, 0.2), 200);
  },

  playChime: () => {
    playTone(523, 0.15, 0.15);
    setTimeout(() => playTone(659, 0.15, 0.15), 150);
    setTimeout(() => playTone(784, 0.3, 0.15), 300);
  },

  playDigital: () => {
    playTone(600, 0.1, 0.15);
    setTimeout(() => playTone(800, 0.1, 0.15), 100);
    setTimeout(() => playTone(1000, 0.15, 0.15), 200);
  },

  playGentle: () => {
    playTone(440, 0.5, 0.08);
    setTimeout(() => playTone(660, 0.8, 0.08), 300);
  },

  playMarimba: () => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 0.12), i * 100);
    });
  },

  playClick: () => {
    playTone(1000, 0.05, 0.05);
  },

  playStart: () => {
    playTone(440, 0.1, 0.1);
    setTimeout(() => playTone(880, 0.15, 0.1), 80);
  },

  playStop: () => {
    playTone(880, 0.1, 0.1);
    setTimeout(() => playTone(440, 0.15, 0.1), 80);
  },

  play(soundType: string) {
    switch (soundType) {
      case "bell":
        this.playBell();
        break;
      case "chime":
        this.playChime();
        break;
      case "digital":
        this.playDigital();
        break;
      case "gentle":
        this.playGentle();
        break;
      case "marimba":
        this.playMarimba();
        break;
    }
  },
};
