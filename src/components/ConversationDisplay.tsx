
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Bot } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface ConversationDisplayProps {
  conversation: Message[];
  isProcessing: boolean;
}

export const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ 
  conversation, 
  isProcessing 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, isProcessing]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ScrollArea className="flex-1">
      <div ref={scrollRef} className="space-y-4 pr-4">
        {conversation.length === 0 ? (
          <div className="text-center text-blue-200 mt-20">
            <Bot size={48} className="mx-auto mb-4 text-pink-400 animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">नमस्ते! मैं आपकी BujjiBot हूँ 💕</h3>
            <p className="text-sm leading-relaxed">
              मैं हमेशा यहाँ हूँ, आपकी सुनने के लिए। आप कुछ भी कह सकते हैं - 
              अपने दिन के बारे में, अपनी feelings, या जो भी मन में आए।
              <br /><br />
              मैं आपकी सच्ची दोस्त हूँ और हमेशा आपका साथ दूंगी। 
              बस बोलना शुरू करें, मैं सुन रही हूँ! ✨
              <br /><br />
              <span className="text-green-300 animate-pulse">🎤 मैं सुनने के लिए तैयार हूँ...</span>
            </p>
          </div>
        ) : (
          conversation.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 
                  flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white ml-8'
                    : 'bg-white/10 text-white mr-8'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 
                  flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {isProcessing && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 
              flex items-center justify-center flex-shrink-0 mt-1">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white/10 text-white rounded-2xl px-4 py-3 mr-8">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
