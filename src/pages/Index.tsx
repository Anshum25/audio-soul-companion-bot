
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Heart, Brain, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConversationDisplay } from '@/components/ConversationDisplay';
import { EmotionalCore } from '@/components/EmotionalCore';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { AIResponseHandler } from '@/components/AIResponseHandler';

const Index = () => {
  const [isListening, setIsListening] = useState(true); // Always start listening
  const [conversation, setConversation] = useState([]);
  const [currentMood, setCurrentMood] = useState('listening'); // Start in listening mode
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Load saved conversations and user data
    const savedConversations = localStorage.getItem('bujjibot-conversations');
    const savedUserName = localStorage.getItem('bujjibot-username');
    
    if (savedConversations) {
      setConversation(JSON.parse(savedConversations));
    }
    
    if (savedUserName) {
      setUserName(savedUserName);
    }

    // Auto-start listening when app loads
    console.log('BujjiBot is now always listening...');
  }, []);

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript) return;

    console.log('Voice input received:', transcript);
    
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: transcript,
      timestamp: new Date().toISOString()
    };

    const updatedConversation = [...conversation, newMessage];
    setConversation(updatedConversation);
    setIsProcessing(true);
    setCurrentMood('thinking');

    // Save to localStorage
    localStorage.setItem('bujjibot-conversations', JSON.stringify(updatedConversation));
  };

  const handleAIResponse = (response: string) => {
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: response,
      timestamp: new Date().toISOString()
    };

    const updatedConversation = [...conversation, aiMessage];
    setConversation(updatedConversation);
    setIsProcessing(false);
    setCurrentMood('listening'); // Return to listening after response

    // Save to localStorage
    localStorage.setItem('bujjibot-conversations', JSON.stringify(updatedConversation));

    // Speak the response with female Hindi voice
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      
      // Find a female Hindi voice or fallback to female English voice
      const voices = speechSynthesis.getVoices();
      const hindiVoice = voices.find(voice => 
        voice.lang.includes('hi') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => 
        voice.lang.includes('hi')
      ) || voices.find(voice => 
        voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman')
      );

      if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
      } else {
        // Fallback settings for more feminine voice
        utterance.lang = 'hi-IN';
      }
      
      utterance.rate = 0.8;
      utterance.pitch = 1.3; // Higher pitch for more feminine voice
      utterance.volume = 0.8;
      
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setCurrentMood('listening');
    } else {
      setCurrentMood('calm');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            BujjiBot
          </h1>
          <p className="text-blue-200 text-lg">आपकी हमेशा साथ रहने वाली AI सहेली 💕</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-blue-200">
              {isListening ? 'हमेशा सुन रही हूँ...' : 'बंद है'}
            </span>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emotional Core */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                  <Heart className="text-pink-400" size={24} />
                  मेरा दिल
                </h3>
                <EmotionalCore mood={currentMood} isProcessing={isProcessing} />
              </div>

              {/* Voice Controls - Optional toggle */}
              <div className="space-y-4">
                <Button
                  onClick={toggleListening}
                  className={`w-full h-16 text-lg font-semibold transition-all duration-300 ${
                    isListening
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isListening ? (
                    <>
                      <Mic className="mr-2" size={24} />
                      सुन रही हूँ
                    </>
                  ) : (
                    <>
                      <MicOff className="mr-2" size={24} />
                      सुनना बंद
                    </>
                  )}
                </Button>

                <div className="text-sm text-blue-200 text-center">
                  {isListening ? 
                    'मैं हमेशा यहाँ हूँ! आप कुछ भी कह सकते हैं।' : 
                    'मुझे चालू करने के लिए ऊपर click करें'
                  }
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-200">बातचीत:</span>
                  <span className="text-white font-semibold">{Math.floor(conversation.length / 2) || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-200">मूड:</span>
                  <span className="text-white font-semibold capitalize">
                    {currentMood === 'listening' ? 'सुन रही हूँ' : 
                     currentMood === 'thinking' ? 'सोच रही हूँ' : 
                     currentMood === 'happy' ? 'खुश हूँ' : 'शांत हूँ'}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Conversation Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 h-[600px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="text-blue-400" size={24} />
                <h3 className="text-xl font-semibold">हमारी बातचीत</h3>
              </div>
              
              <ConversationDisplay 
                conversation={conversation} 
                isProcessing={isProcessing}
              />
            </Card>
          </div>
        </div>

        {/* Hidden Components for Functionality */}
        <VoiceRecorder 
          isListening={isListening}
          onTranscript={handleVoiceInput}
        />
        
        <AIResponseHandler
          conversation={conversation}
          onResponse={handleAIResponse}
          userName={userName}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default Index;
