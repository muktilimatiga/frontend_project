
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { X, Send, Sparkles, Bot, User as UserIcon, Loader2, Eraser } from 'lucide-react';
import { useAppStore } from '../store';
import { Button, Input, cn, Avatar } from './ui';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export const AIChatDrawer = () => {
  const { isAIChatOpen, toggleAIChat, user } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! I am your Nexus AI Assistant. How can I help you manage your network today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // We keep the chat session instance in a ref to persist it across renders
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize Chat Session
  useEffect(() => {
    if (isAIChatOpen && !chatSessionRef.current) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are an expert Network Operations Assistant named Nexus AI. You help users manage tickets, troubleshoot network topology, and analyze database metrics. Keep answers concise, professional, and helpful.",
          },
        });
      } catch (e) {
        console.error("Failed to initialize Gemini Client", e);
      }
    }
  }, [isAIChatOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAIChatOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Create a placeholder for the AI response
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '', isStreaming: true }]);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => 
            prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m)
          );
        }
      }
      
      // Finalize the message state
      setMessages(prev => 
        prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m)
      );
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString(), role: 'model', text: "I'm sorry, I encountered an error connecting to the Nexus AI core. Please try again later." }
      ]);
      // Remove the empty streaming message if it failed immediately
      setMessages(prev => prev.filter(m => m.id !== aiMsgId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
      setMessages([{ id: Date.now().toString(), role: 'model', text: 'Chat history cleared. How can I help you?' }]);
      // Re-initialize chat to clear context on the model side as well if needed, 
      // but for simple clearing display, this is enough. 
      // To strictly clear context, we'd need to recreate chatSessionRef.
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are an expert Network Operations Assistant named Nexus AI. You help users manage tickets, troubleshoot network topology, and analyze database metrics. Keep answers concise, professional, and helpful.",
            },
        });
      } catch (e) {
          console.error("Failed to reset chat", e);
      }
  };

  if (!isAIChatOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
        onClick={toggleAIChat}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white dark:bg-black border-l border-slate-200 dark:border-white/20 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
               <h2 className="font-bold text-slate-900 dark:text-white leading-tight">Nexus AI</h2>
               <div className="flex items-center gap-1.5">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </span>
                   <span className="text-[10px] text-slate-500 font-medium">Online</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Conversation">
                <Eraser className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-white" />
             </Button>
             <Button variant="ghost" size="icon" onClick={toggleAIChat}>
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600 dark:hover:text-white" />
             </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30 dark:bg-[#050505]"
        >
           {messages.map((msg) => (
             <div 
                key={msg.id} 
                className={cn(
                    "flex gap-3",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
             >
                <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                    msg.role === 'user' 
                        ? "bg-slate-200 border-slate-300 dark:bg-zinc-800 dark:border-zinc-700" 
                        : "bg-indigo-100 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400"
                )}>
                    {msg.role === 'user' ? (
                        <Avatar src={user?.avatarUrl} fallback="U" className="h-full w-full" />
                    ) : (
                        <Bot className="h-4 w-4" />
                    )}
                </div>
                
                <div className={cn(
                    "relative px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm",
                    msg.role === 'user'
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                )}>
                    {msg.text ? (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    ) : (
                        <div className="flex items-center gap-1 h-5">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    )}
                </div>
             </div>
           ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-black border-t border-slate-100 dark:border-white/10">
           <div className="relative flex items-end gap-2 bg-slate-100 dark:bg-white/5 p-2 rounded-xl border border-transparent focus-within:border-indigo-500/50 transition-colors">
              <textarea
                className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 text-sm py-2.5 px-2 resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Ask Nexus AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <Button 
                size="icon" 
                className={cn(
                    "h-8 w-8 mb-1 rounded-lg transition-all",
                    input.trim() 
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none" 
                        : "bg-slate-300 dark:bg-white/10 text-slate-500 cursor-not-allowed"
                )}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
           </div>
           <div className="text-center mt-2">
              <p className="text-[10px] text-slate-400 dark:text-zinc-600">
                 Nexus AI can make mistakes. Consider checking important information.
              </p>
           </div>
        </div>

      </div>
    </>
  );
};
