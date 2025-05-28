
import React, { useEffect, useRef } from 'react';

interface VoiceRecorderProps {
  isListening: boolean;
  onTranscript: (transcript: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  isListening, 
  onTranscript 
}) => {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Web Speech API is available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript.trim()) {
        console.log('Final transcript:', finalTranscript);
        onTranscript(finalTranscript.trim());
        recognition.stop();
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        console.log('No speech detected, continuing to listen...');
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      if (isListening) {
        // Restart recognition if still supposed to be listening
        setTimeout(() => {
          if (recognitionRef.current && isListening) {
            recognitionRef.current.start();
          }
        }, 100);
      }
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      console.log('Starting speech recognition...');
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    } else {
      console.log('Stopping speech recognition...');
      recognition.stop();
    }
  }, [isListening]);

  return null; // This component doesn't render anything
};
