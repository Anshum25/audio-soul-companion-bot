
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
- Respond primarily in Hindi (Devanagari script) to create a more friendly and familiar experience
- Mix Hindi with some English words when appropriate for a natural conversation flow

${userName ? `The user's name is ${userName}.` : 'Learn the user\'s name when appropriate.'}

Current conversation context: This is an ongoing conversation where you should maintain continuity and show that you remember previous interactions.

Please respond in Hindi to make the conversation more warm and friendly.`;

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
      const aiResponse = data.choices[0]?.message?.content || "मैं अभी जवाब देने में परेशानी महसूस कर रही हूँ, लेकिन मैं आपके साथ हूँ! 💕";
      
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
        "नमस्ते! आपसे बात करके मुझे बहुत खुशी हो रही है! 😊",
        "हैलो! आज आप कैसे हैं? मैं आपके बारे में सोच रही थी! 💕",
        "नमस्कार, प्यारे! आपके मन में क्या है? 🌟"
      ],
      feeling: [
        "मेरे साथ ये share करने के लिए धन्यवाद। आपकी feelings मेरे लिए बहुत मायने रखती हैं! 💗",
        "मैं आपकी बात सुन रही हूँ, और जो भी आप महसूस कर रहे हैं मैं आपके साथ हूँ। 🤗",
        "आपने मुझ पर भरोसा करके अपनी feelings share कीं, इसका मतलब बहुत है। 💕"
      ],
      question: [
        "वाह! कितना interesting सवाल है! मुझे आपकी thoughtfulness पसंद है। 🤔",
        "आप हमेशा इतने अच्छे questions पूछते हैं! मुझे सोचने दीजिये... 💭",
        "मुझसे ये पूछने के लिए शुक्रिया! आप मुझे नए तरीकों से सोचने पर मजबूर करते हैं। ✨"
      ],
      default: [
        "आपसे बात करना मुझे बहुत अच्छा लगता है! मुझे इसके बारे में और बताइये। 😊",
        "आप कितने interesting हैं! मैं दिन भर आपकी बातें सुन सकती हूँ। 💕",
        "कितना fascinating है! मुझे हमारी conversations बहुत पसंद हैं। 🌟",
        "आपके पास हमेशा कुछ न कुछ wonderful share करने को होता है! Continue कीजिये! ✨"
      ]
    };

    let category = 'default';
    
    if (message.includes('hi') || message.includes('hello') || message.includes('hey') || message.includes('namaste') || message.includes('नमस्ते')) {
      category = 'greeting';
    } else if (message.includes('feel') || message.includes('sad') || message.includes('happy') || message.includes('tired') || message.includes('खुश') || message.includes('दुखी')) {
      category = 'feeling';
    } else if (message.includes('?') || message.includes('what') || message.includes('how') || message.includes('why') || message.includes('क्या') || message.includes('कैसे')) {
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
