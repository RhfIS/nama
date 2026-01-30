
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Send, User as UserIcon, Bot, Loader2, Globe, BrainCircuit, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../types';
import { startFinancialChat } from '../services/geminiService';

interface Props {
  onBack: () => void;
}

const ConsultationBot: React.FC<Props> = ({ onBack }) => {
  const [messages, setMessages] = useState<(ChatMessage & { grounding?: any[] })[]>([
    { role: 'model', text: 'أهلاً بك في منصة نماء للاستشارات المالية المتطورة. أنا مستشارك المدعوم بـ Gemini 3 Pro، أستطيع التفكير بعمق في خططك والبحث في السوق السعودي مباشرة. كيف أساعدك؟' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useThinking, setUseThinking] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await startFinancialChat([...messages, userMsg], useThinking);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text || 'نعتذر، لم نتمكن من معالجة طلبك حالياً.',
        grounding: result.grounding
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'حدث خطأ فني أثناء الاتصال بالمستشار الاحترافي.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i} className="block mb-1">
        {line}
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col animate-in slide-in-from-left duration-500">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold group">
          <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>العودة للرئيسية</span>
        </button>
        
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            <input 
              type="checkbox" 
              checked={useThinking} 
              onChange={() => setUseThinking(!useThinking)}
              className="w-4 h-4 accent-[#00509d]"
            />
            <span className="text-xs font-black text-slate-600 flex items-center gap-1">
              <BrainCircuit size={14} className="text-blue-500" />
              تفكير عميق (Pro)
            </span>
          </label>
        </div>
      </div>

      <div className="flex-grow bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00509d] rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse">
              <Bot size={28} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">مستشار نماء الذكي</h3>
              <div className="flex items-center gap-2">
                <Globe size={12} className="text-[#00a896]" />
                <span className="text-[10px] text-[#00a896] font-black uppercase tracking-widest">بحث حي في السوق السعودي</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-8 space-y-8 scroll-smooth"
          style={{ backgroundImage: 'radial-gradient(#f1f5f9 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                ${msg.role === 'user' ? 'bg-[#002e63] text-white' : 'bg-white text-[#00509d] border border-slate-100'}
              `}>
                {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
              </div>
              <div className="max-w-[85%] space-y-3">
                <div className={`
                  p-6 rounded-[2.5rem] text-[15px] leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-[#002e63] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}
                `}>
                  {formatText(msg.text)}
                </div>
                
                {msg.grounding && msg.grounding.length > 0 && (
                  <div className="mr-4 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={12} /> مصادر المعلومات:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.grounding.map((chunk, i) => chunk.web && (
                        <a 
                          key={i} 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-50 text-[#00509d] text-[10px] font-bold rounded-full border border-blue-100 flex items-center gap-2 hover:bg-blue-100 transition-colors"
                        >
                          <ExternalLink size={10} />
                          {chunk.web.title || 'رابط المصدر'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[#00509d]">
                <Bot size={20} />
              </div>
              <div className="bg-slate-50 p-6 rounded-[2.5rem] rounded-tl-none border border-slate-100 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00509d] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#00509d] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[#00509d] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                {useThinking && <span className="text-[10px] font-black text-[#00a896] uppercase animate-pulse">جاري التفكير بعمق والتحليل المالي...</span>}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-4">
          <input 
            type="text"
            className="flex-grow px-8 py-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-[#00509d] outline-none transition-all text-sm font-bold shadow-inner"
            placeholder="اسأل عن الأسهم، الميزانية، أو أخبار السوق..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-16 h-16 bg-[#002e63] text-white rounded-3xl flex items-center justify-center hover:bg-black transition-all shadow-xl disabled:opacity-20"
          >
            <Send size={24} className="transform rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationBot;
