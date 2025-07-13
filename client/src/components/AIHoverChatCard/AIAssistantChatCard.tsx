import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import MarkdownRenderer from '../../helper/MarkdownRenderer.tsx';

interface AIAssistantChatCardProps {
  className?: string;
  buttonPosition?: { x: number; y: number; width: number; height: number };
  userData?: {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

const AIAssistantChatCard = ({ className, buttonPosition, userData }: AIAssistantChatCardProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Set initial position when component mounts or button position changes
  useEffect(() => {
    if (buttonPosition) {
      // Position the card under the button and left-aligned
      const cardWidth = 384; // w-96 = 384px
      const cardHeight = 480; // h-[480px]
      
      // Calculate position to left-align with the button
      const initialX = buttonPosition.x;
      const initialY = buttonPosition.y + buttonPosition.height + 16; // 16px gap below button (increased from 8px)
      
      // Ensure the card doesn't go off-screen
      const maxX = window.innerWidth - cardWidth;
      const maxY = window.innerHeight - cardHeight;
      
      setPosition({
        x: Math.max(0, Math.min(initialX, maxX)),
        y: Math.max(0, Math.min(initialY, maxY))
      });
    } 
  }, [buttonPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardRef.current && isDragEnabled) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && isDragEnabled) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep the card within viewport bounds
      const maxX = window.innerWidth - (cardRef.current?.offsetWidth || 384);
      const maxY = window.innerHeight - (cardRef.current?.offsetHeight || 480);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDragHandleMouseLeave = () => {
    // Only disable drag if we're not currently dragging
    if (!isDragging) {
      setIsDragEnabled(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, isDragEnabled]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: input }
    ]);
    setInput("");
    setLoading(true);
    
    if (!userData?._id) {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: "Please log in to use the AI Assistant." },
      ]);
      setLoading(false);
      return;
    }
    
    axios.post(`http://localhost:3000/embed/query/${userData._id}`, {
      query: input
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then((response) => {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: response.data.message?.message || "No response from assistant." },
      ]);
    })
    .catch(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: "glitch" },
      ]);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div 
      ref={cardRef}
      className={`fixed z-50 w-96 h-[480px] bg-white shadow-2xl rounded-xl border-2 border-blue-500 flex flex-col ${className || ""}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none'
      }}
    >
      <div 
        className="w-full flex items-center justify-between px-2 py-3 bg-gray-200/50 rounded-t-xl" 
        style={{ boxSizing: 'border-box' }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 pl-1">
          <img src="/icons/AIAssistant/bi--stars.svg" alt="AI Assistant Icon" className="w-5 h-5" />
          <h2 className="text-lg font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans)">Personal Advisor</h2>
        </div>
        
        {/* 6-dot grid drag handle */}
        <div 
          className="flex items-center justify-center w-6 h-6 rounded cursor-grab active:cursor-grabbing transition-colors"
          onMouseEnter={() => setIsDragEnabled(true)}
          onMouseLeave={handleDragHandleMouseLeave}
          onMouseDown={handleMouseDown}
        >
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 ai-scrollbar mr-2" style={{ scrollbarWidth: 'thin' }}>
        <div className="flex flex-col gap-2 h-full">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center" style={{ minHeight: '220px' }}>
              <div className="bg-gray-50 rounded-lg p-4 w-full max-w-xs text-center font-(family-name:--font-IMFellSerif) font-semibold shadow-sm">
                I am your personal financial/task management advisor. How can I help you today? 🪄
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-3 py-2 shadow-md text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white text-left'
                      : 'bg-gray-300 text-black text-left'
                  }`}
                  style={
                    msg.sender === 'user'
                      ? { maxWidth: '220px', wordBreak: 'break-word' }
                      : { wordBreak: 'break-word' }
                  }
                >
                  {msg.sender === 'assistant' ? (
                    <MarkdownRenderer mdText={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-300 text-black rounded-2xl px-3 py-2 shadow-md text-sm animate-pulse">
                Assistant is typing...
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Chatbot UI will go here */}
      <div className="w-full bg-gray-200/50 p-2 rounded-b-xl mt-auto" style={{ boxSizing: 'border-box' }}>
        <form className="flex items-center gap-2 rounded-full border-3 border-blue-500 bg-white px-2 py-5 w-full h-[40px]" style={{ boxSizing: 'border-box' }} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask AI Agent Something"
            className="flex-1 rounded-full px-2 py-1 text-sm focus:outline-none transition-all h-8 bg-white border-none shadow-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 cursor-pointer hover:bg-blue-700 transition-colors ml-1 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
            disabled={!input.trim() || loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="text-white">
              <path fill="#fff" d="M20.04 2.323c1.016-.355 1.992.621 1.637 1.637l-5.925 16.93c-.385 1.098-1.915 1.16-2.387.097l-2.859-6.432l4.024-4.025a.75.75 0 0 0-1.06-1.06l-4.025 4.024l-6.432-2.859c-1.063-.473-1-2.002.097-2.387z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantChatCard; 