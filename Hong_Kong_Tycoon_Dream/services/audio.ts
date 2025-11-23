class AudioService {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    // In a real app, these would be imported files. Using placeholders or inline base64 could work,
    // but for this scope we will simulate the interface.
    // Just relying on visual cues if no audio files present.
  }

  play(type: 'roll' | 'buy' | 'pay' | 'win' | 'jail') {
    if (!this.enabled) return;
    
    // Placeholder logic. To make this fully functional, valid URLs are needed.
    // Since I cannot host files, I will just console log which represents the trigger.
    console.log(`[Audio] Playing sound: ${type}`);
    
    // Example of how it would work:
    // const audio = new Audio(`/assets/sounds/${type}.mp3`);
    // audio.play().catch(e => console.warn("Audio play failed", e));
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const audioService = new AudioService();