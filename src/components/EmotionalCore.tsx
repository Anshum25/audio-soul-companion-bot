
import React from 'react';

interface EmotionalCoreProps {
  mood: string;
  isProcessing: boolean;
}

export const EmotionalCore: React.FC<EmotionalCoreProps> = ({ mood, isProcessing }) => {
  const getMoodColor = () => {
    switch (mood) {
      case 'happy': return 'from-yellow-400 to-orange-400';
      case 'thinking': return 'from-purple-400 to-blue-400';
      case 'listening': return 'from-green-400 to-teal-400';
      case 'excited': return 'from-pink-400 to-red-400';
      case 'calm': 
      default: return 'from-blue-400 to-cyan-400';
    }
  };

  const getMoodEmoji = () => {
    switch (mood) {
      case 'happy': return '😊';
      case 'thinking': return '🤔';
      case 'listening': return '👂';
      case 'excited': return '🤗';
      case 'calm':
      default: return '😌';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Emotional Orb */}
      <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getMoodColor()} 
        ${isProcessing ? 'animate-pulse' : 'animate-bounce'} 
        shadow-2xl relative mb-4 transition-all duration-500`}>
        
        {/* Inner Glow */}
        <div className="absolute inset-2 rounded-full bg-white/20 animate-pulse"></div>
        
        {/* Face */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">{getMoodEmoji()}</span>
        </div>
        
        {/* Outer Ring Animation */}
        <div className={`absolute -inset-2 rounded-full border-2 border-white/30 
          ${isProcessing ? 'animate-spin' : ''}`}></div>
      </div>

      {/* Mood Text */}
      <div className="text-center">
        <h4 className="text-lg font-semibold capitalize text-white mb-1">{mood}</h4>
        {isProcessing && (
          <p className="text-sm text-blue-200 animate-pulse">Processing your message...</p>
        )}
      </div>

      {/* Personality Traits */}
      <div className="mt-4 text-xs text-blue-200 text-center space-y-1">
        <p>💝 Caring & Supportive</p>
        <p>🧠 Always Learning</p>
        <p>🌟 Positive & Encouraging</p>
      </div>
    </div>
  );
};
