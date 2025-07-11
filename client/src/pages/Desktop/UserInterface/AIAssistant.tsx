import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export function fixMarkdownLineBreaks(mdText: string): string {
  return mdText
    .replace(/\\n\\n/g, '\n \n')         // handle double \n as paragraph breaks
    .replace(/\\n/g, '  \n');           // handle single \n as markdown line breaks
}

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "assistant"; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/embed/query/685a077739b9a7f470eab57b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: data.message?.message || "No response from assistant." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Sorry, there was an error processing your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-1 pb-2">
      <h1 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexSans) mb-4">
        Personal Assistant
      </h1>
      {/* Chat messages box (full width bg) */}
      <div
        ref={chatContainerRef}
        className={`flex-1 bg-[#E7D7D7] rounded-lg px-2 pb-4 mb-2 overflow-y-auto flex flex-col items-center scrollbar-hide${messages.length === 0 ? " justify-center" : ""}`}
        style={{ minHeight: "300px" }}
      >
        <div className="w-full max-w-[800px] flex flex-col">
          {messages.length === 0 ? (
            <div className="p-8 w-full max-w-xl flex flex-col justify-center text-left mx-auto">
              <div
                className="font-semibold text-4xl mb-6 font-(family-name:--font-IMFellSerif)" 
                style={{ letterSpacing: "0.05em" }}
              >
                Ask Me Anything
              </div>
              <div
                className="text-base text-[#3F3131] mb-1 mt-2 font-(family-name:--font-IBMPlexSans)"
              >
                Some tasks I can handle for you:
              </div>
              <ul className="list-disc list-inside text-[#3F3131] space-y-1">
                <li>Create a new Reminder</li>
                <li>Check how many assignments are approaching its deadline</li>
                <li>Add a New Class</li>
                <li>Check Bank Balances and Credit Card Debt</li>
                <li>Current Interest Generated from Bank Accounts</li>
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-2 py-8">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.sender === "user"
                      ? "self-end bg-white text-[#3F3131] text-sm px-4 py-3 font-medium rounded-xl max-w-sm shadow font-(family-name:--font-IBMPlexSans)"
                      : "self-start bg-[#EAE3E3]  px-4 py-3 rounded-xl max-w-sm shadow"
                  }
                >
                  {msg.sender === "assistant" ? (
                    <ReactMarkdown>{fixMarkdownLineBreaks(msg.text)}</ReactMarkdown>
                  ) : (
                    fixMarkdownLineBreaks(msg.text)
                  )}
                </div>
              ))}
              {loading && (
                <div className="self-start bg-[#EAE3E3] text-black px-4 text-sm py-3 rounded-xl font-medium max-w-sm shadow font-(family-name:--font-IBMPlexSans) opacity-70 animate-pulse">
                  Assistant is typing...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Input area (full width) */}
      <div
        className="flex items-center mt-2 gap-2"
        style={{ marginTop: "2pt" }}
      >
        <input
          type="text"
          placeholder="Type Anything..."
          className="flex-1 rounded-lg px-4 py-2 focus:outline-none text-[#3F3131] bg-[#E7D7D7] placeholder-[#8A7C7C]"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-[#10BC2D] cursor-pointer rounded-lg px-6 py-2 flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ height: "100%" }}
          onClick={handleSend}
          disabled={!input.trim() || loading}
        >
          <img
            src="/icons/AIAssistant/mynaui--send-solid.svg"
            alt="Send"
            className="w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
}
