import { Language } from '../types';

class AudioSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingCallback: ((speaking: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setSpeakingListener(cb: (speaking: boolean) => void) {
    this.isSpeakingCallback = cb;
  }

  public speak(text: string, language: Language = 'hi') {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this environment.');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Pick appropriate voice tag
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92; // slightly deliberate for elders
      utterance.pitch = 1.0;
    } else if (language === 'or') {
      utterance.lang = 'hi-IN'; // Fallback to Indian accent if Odia TTS voice is unavailable
      utterance.rate = 0.9;
    } else {
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
    }

    // Try to find native Indian voices if available
    const voices = this.synth.getVoices();
    if (voices && voices.length > 0) {
      const preferred = voices.find(
        v =>
          (language === 'hi' && (v.lang.includes('hi') || v.lang.includes('hi_IN') || v.name.includes('Hindi') || v.name.includes('Kalpana') || v.name.includes('Lekha'))) ||
          (language === 'en' && (v.lang === 'en-IN' || v.name.includes('India') || v.name.includes('Ravi') || v.name.includes('Heera')))
      );
      if (preferred) {
        utterance.voice = preferred;
      }
    }

    utterance.onstart = () => {
      if (this.isSpeakingCallback) this.isSpeakingCallback(true);
    };

    utterance.onend = () => {
      if (this.isSpeakingCallback) this.isSpeakingCallback(false);
      this.currentUtterance = null;
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      if (this.isSpeakingCallback) this.isSpeakingCallback(false);
      this.currentUtterance = null;
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Failed to speak utterance:', err);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.isSpeakingCallback) {
      this.isSpeakingCallback(false);
    }
    this.currentUtterance = null;
  }

  public isSupported(): boolean {
    return !!this.synth;
  }
}

export const audioSpeech = new AudioSpeechService();