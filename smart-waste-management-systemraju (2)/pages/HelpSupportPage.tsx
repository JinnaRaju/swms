
import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import { getBotResponse } from '../services/geminiService';

const HelpSupportPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hello! How can I assist you with the Smart Waste Management System today?", sender: 'bot', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botResponseText = await getBotResponse(input);
    
    const botMessage: ChatMessage = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  const faqs = [
    { q: "How do I file a new complaint?", a: "Navigate to the 'New Complaint' page from the dashboard. You can upload a photo of the waste issue, specify the location, and add a description." },
    { q: "Where can I check the status of my complaint?", a: "Go to the 'Status Tracking' page. It shows all your active complaints with their current progress and estimated resolution time." },
    { q: "What is the Awards page for?", a: "The Awards page recognizes your contributions! You can earn badges and see your rank on the leaderboard by regularly reporting waste-related issues." }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-10rem)]">
      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Live Support Chat</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">♻️</div>}
              <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                <p>{msg.text}</p>
                <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-200' : 'text-gray-500'} text-right`}>{msg.timestamp}</div>
              </div>
              {msg.sender === 'user' && <img src={user?.profilePictureUrl} className="w-8 h-8 rounded-full" />}
            </div>
          ))}
          {isLoading && <div className="flex items-end gap-2"><div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">♻️</div><div className="p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">Typing...</div></div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:bg-green-300">
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow">
         <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">FAQs</h3>
         <div className="space-y-4">
            {faqs.map((faq, index) => (
                <details key={index}>
                    <summary className="font-semibold text-gray-700 cursor-pointer hover:text-green-600">{faq.q}</summary>
                    <p className="mt-2 text-gray-600 text-sm pl-4 border-l-2 border-green-200">{faq.a}</p>
                </details>
            ))}
         </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
