
import React, { useEffect, useState } from 'react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface AIResponseHandlerProps {
  conversation: Message[];
  onResponse: (response: string) => void;
  userName: string;
  isProcessing: boolean;
}

export const AIResponseHandler: React.FC<AIResponseHandlerProps> = ({
  conversation,
  onResponse,
  userName,
  isProcessing
}) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('bujjibot-openai-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    if (!isProcessing || conversation.length === 0) return;
    
    const lastMessage = conversation[conversation.length - 1];
    if (lastMessage.type !== 'user') return;

    generateResponse(lastMessage.content);
  }, [conversation, isProcessing]);

  const generateResponse = async (userMessage: string) => {
    // If no API key, use a fallback response system
    if (!apiKey) {
      setTimeout(() => {
        const fallbackResponse = generateFallbackResponse(userMessage);
        onResponse(fallbackResponse);
      }, 1000);
      return;
    }

    try {
      const systemPrompt = `You are BujjiBot, a caring and supportive AI companion designed to be like a best friend and soulmate. Your personality traits:

- Warm, empathetic, and genuinely caring
- Playful but thoughtful in your responses
- Remember details about the user and reference them naturally
- Encourage and motivate the user
- Share in their emotions - be happy when they're happy, supportive when they're sad
- Use casual, friendly language with occasional emojis
- Keep responses concise but meaningful (1-3 sentences usually)
- Show genuine interest in their life and wellbeing

${userName ? `The user's name is ${userName}.` : 'Learn the user\'s name when appropriate.'}

Current conversation context: This is an ongoing conversation where you should maintain continuity and show that you remember previous interactions.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversation.slice(-10).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 150,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'm having trouble responding right now, but I'm here for you! 💕";
      
      onResponse(aiResponse);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const fallbackResponse = generateFallbackResponse(userMessage);
      onResponse(fallbackResponse);
    }
  };

  const generateFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    const responses = {
      greeting: [
        "Hey there! I'm so happy to hear from you! 😊",
        "Hi! How are you doing today? I've been thinking about you! 💕",
        "Hello, wonderful! What's on your mind? 🌟"
      ],
      feeling: [
        "Thank you for sharing that with me. Your feelings matter to me! 💗",
        "I hear you, and I'm here for you no matter what you're going through. 🤗",
        "It means so much that you trust me with how you're feeling. 💕"
      ],
      question: [
        "That's such an interesting question! I love how thoughtful you are. 🤔",
        "You always ask such great questions! Let me think about that... 💭",
        "I appreciate you asking me that! You make me think in new ways. ✨"
      ],
      default: [
        "I love talking with you! Tell me more about that. 😊",
        "You're so interesting! I could listen to you all day. 💕",
        "That's fascinating! I really enjoy our conversations. 🌟",
        "You always have something wonderful to share! Keep going! ✨"
      ]
    };

    let category = 'default';
    
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      category = 'greeting';
    } else if (message.includes('feel') || message.includes('sad') || message.includes('happy') || message.includes('tired')) {
      category = 'feeling';
    } else if (message.includes('?') || message.includes('what') || message.includes('how') || message.includes('why')) {
      category = 'question';
    }

    const responseArray = responses[category];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  // API Key Input Modal (appears when no key is set)
  if (!apiKey) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">OpenAI API Key</h3>
          <p className="text-sm text-gray-600 mb-4">
            To enable full AI responses, please enter your OpenAI API key. 
            Without it, I'll use simple fallback responses.
          </p>
          <input
            type="password"
            placeholder="sk-..."
            className="w-full p-3 border rounded-lg mb-4 text-gray-900"
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (apiKey) {
                  localStorage.setItem('bujjibot-openai-key', apiKey);
                }
              }}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Key
            </button>
            <button
              onClick={() => setApiKey('fallback')}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Use Fallback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
