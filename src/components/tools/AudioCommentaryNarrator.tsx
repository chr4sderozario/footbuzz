/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Live Text-to-Speech (TTS) Match Commentary Narrator
 * Voice commentary engine utilizing the browser SpeechSynthesis API.
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Play, Pause, Radio, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AudioCommentaryNarratorProps {
  currentEventText?: string;
  matchTitle?: string;
}

export const AudioCommentaryNarrator: React.FC<AudioCommentaryNarratorProps> = ({
  currentEventText = 'Mohun Bagan breaking forward on the counter-attack through Petratos!',
  matchTitle = 'Live Match',
}) => {
  const { addToast } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  const speakText = (text: string) => {
    if (!hasSpeechSupport) {
      addToast('Audio Notice', 'Speech synthesis is not supported on this browser.', 'ALERT');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick an English or high quality voice if available
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find((v) => v.lang.includes('en') && v.name.includes('Natural')) ||
      voices.find((v) => v.lang.includes('en')) ||
      voices[0];

    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggle = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speakText(`${matchTitle}. Live Commentary: ${currentEventText}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 ${
          isPlaying
            ? 'bg-rose-600 text-white animate-pulse'
            : 'bg-[#009270] hover:bg-[#028060] text-white'
        }`}
        title="Live Text-to-Speech Commentary"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        <span>{isPlaying ? 'Pause Voice' : 'Listen Live (TTS)'}</span>
      </button>
    </div>
  );
};
