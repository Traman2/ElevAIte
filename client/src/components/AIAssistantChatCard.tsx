import React, { useState } from "react";

const sampleMessages = [
  { sender: "ai", text: "Hello! How can I help you today?" },
  { sender: "user", text: "Show me my recent transactions." },
  { sender: "ai", text: "Here are your 3 most recent transactions..." },
];

export default function AIAssistantChatCard({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState(sampleMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 80,
        width: 340,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        marginBottom: 32,
        marginLeft: 8,
        marginRight: 8,
        zIndex: 100,
        border: "1.5px solid #1db954",
        display: "flex",
        flexDirection: "column",
        minHeight: 320,
        maxHeight: 420,
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                background: msg.sender === "user" ? "#e6f4ea" : "#f1f1f1",
                color: "#222",
                borderRadius: 12,
                padding: "8px 14px",
                maxWidth: 220,
                fontSize: 15,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      {/* Floating input box */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "2px solid #1db954",
          borderRadius: 24,
          background: "#fff",
          margin: "0 18px 18px 18px",
          padding: "6px 12px 6px 6px",
          boxShadow: "0 2px 8px rgba(30,185,84,0.08)",
        }}
      >
        <button
          onClick={handleSend}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#1db954",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(30,185,84,0.10)",
          }}
          aria-label="Send"
        >
          <svg width="18" height="18" fill="#fff" viewBox="0 0 24 24">
            <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
          placeholder="Type your message..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: 15,
            background: "transparent",
            padding: "6px 0",
          }}
        />
      </div>
    </div>
  );
} 