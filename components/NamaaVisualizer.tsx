
import React, { useState } from 'react';
import { ArrowRight, Sparkles, Image as ImageIcon, Loader2, Wand2, Home, Rocket, Plane, Briefcase, Camera, ExternalLink, ShieldCheck, Key } from 'lucide-react';
import { generateGoalVisual } from '../services/geminiService';

interface Props {
  onBack: () => void;
}

// Fixed: Removed conflicting global declaration for aistudio tools.
// The environment already provides a standard definition for window.aistudio.

const GOAL_TEMPLATES = [
  { id: 'home', title: 'منزل الأحلام', prompt: 'A futuristic luxury smart villa in NEOM with hanging gardens and solar panels, Saudi architecture style', icon: <Home size={20} /> },
  { id: 'business', title: 'مقر مشروعي', prompt: 'A sleek modern tech hub office in King Abdullah Financial District (KAFD) Riyadh, young Saudis working, sunset lighting', icon: <Briefcase size={20} /> },
  { id: 'travel', title: 'رحلة العمر', prompt: 'An ultra-luxurious private resort over the water in the Red Sea project, Saudi Arabia, tropical vibes', icon: <Plane size={20} /> },
  { id: 'future', title: 'مستقبل طموح', prompt: 'A high-speed electric car charging station with futuristic Saudi designs, clean lines, high-tech environment', icon: <Rocket size={20} /> },
];

const NamaaVisualizer: React.FC<Props> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");

  const handleGenerate = async () => {
    setError(null);
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      // CRITICAL: Handle API Key Selection as per guidelines for gemini-3-pro-image-preview
      // Use (window as any) to safely access aistudio if the global type is still being resolved.
      const aistudio = (window as any).aistudio;
      if (typeof aistudio !== 'undefined') {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await aistudio.openSelectKey();
          // GUIDELINE: Assume success after trigger and proceed
        }
      }

      const url = await generateGoalVisual(prompt, imageSize);
      setImageUrl(url);
    } catch (err: any) {
      console.error(err);
      // GUIDELINE: Handle "Requested entity was not found" error
      if (err.message?.includes("Requested entity was not found")) {
        setError("يتطلب هذا النموذج اختيار مفتاح API صالح من مشروع مدفوع.");
        const aistudio = (window as any).aistudio;
        if (typeof aistudio !== 'undefined') {
          await aistudio.openSelectKey();
        }
      } else {
        setError("حدث خطأ أثناء رسم هدفك. تأكد من توفر مفتاح API وتفعيل الفوترة في مشروعك.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-left duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold group w-fit">
          <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>العودة للرئيسية</span>
        </button>

        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm"
        >
          <Key size={14} className="text-blue-500" />
          إدارة مفاتيح API والفوترة
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[100%] -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 mb-10 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00509d] to-[#00a896] text-white rounded-[1.8rem] flex items-center justify-center shadow-lg transform rotate-3">
                <Wand2 size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">مخيلة نماء</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">حوّل طموحاتك لواقع مرئي</p>
              </div>
            </div>

            <div className="space-y-8 relative">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ماذا تريد أن تحقق؟</label>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-full border border-slate-100">
                  {(["1K", "2K", "4K"] as const).map(size => (
                    <button 
                      key={size}
                      onClick={() => setImageSize(size)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${imageSize === size ? 'bg-[#00509d] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea 
                className="w-full px-8 py-7 bg-slate-50 rounded-[2.5rem] border-2 border-transparent focus:border-[#00509d] focus:bg-white outline-none transition-all font-bold text-slate-900 h-44 resize-none shadow-inner text-lg leading-relaxed placeholder:text-slate-300"
                placeholder="صف حلمك المالي بدقة (مثلاً: فيلا على شاطئ أملج، مشروع تقني في الرياض...)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_TEMPLATES.map(temp => (
                  <button 
                    key={temp.id}
                    onClick={() => setPrompt(temp.prompt)}
                    className="p-5 bg-white border border-slate-100 rounded-3xl text-[11px] font-bold text-slate-600 hover:border-[#00a896] hover:text-[#00a896] hover:bg-teal-50/30 transition-all flex items-center gap-3 shadow-sm text-right"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      {temp.icon}
                    </div>
                    {temp.title}
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-5 bg-red-50 text-red-600 rounded-3xl text-xs font-bold border border-red-100 flex items-center gap-4 animate-in slide-in-from-top-2">
                  <div className="bg-white p-2 rounded-full shadow-sm"><ShieldCheck size={20} /></div>
                  <p className="flex-grow">{error}</p>
                </div>
              )}

              <button 
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full py-6 gradient-taibah text-white font-black rounded-[2rem] shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-4 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:grayscale group"
              >
                {loading ? <Loader2 className="animate-spin" size={28} /> : <ImageIcon size={28} className="group-hover:rotate-12 transition-transform" />}
                <span className="text-xl">تخيّل الهدف الآن</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="sticky top-28">
            <div className={`
              w-full aspect-[4/3] rounded-[4.5rem] overflow-hidden border-8 border-white shadow-2xl relative
              ${!imageUrl && !loading ? 'bg-slate-50 flex flex-col items-center justify-center text-slate-200 gap-8' : 'bg-slate-900'}
            `}>
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900/40 backdrop-blur-3xl z-20">
                  <div className="relative mb-12">
                    <div className="w-32 h-32 border-4 border-[#00a896] border-t-transparent rounded-full animate-spin"></div>
                    <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00a896] animate-pulse" size={48} />
                  </div>
                  <p className="font-black text-3xl animate-pulse tracking-tight text-center px-10">جاري رسم ملامح مستقبلك...</p>
                  <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Precision AI Rendering {imageSize}</p>
                </div>
              ) : imageUrl ? (
                <>
                  <img src={imageUrl} alt="Financial Goal" className="w-full h-full object-cover animate-in fade-in duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-12">
                    <button 
                      onClick={() => window.open(imageUrl)} 
                      className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-xs flex items-center gap-3 hover:bg-slate-100 transition-all shadow-2xl transform translate-y-4 group-hover:translate-y-0 duration-500"
                    >
                      <ExternalLink size={16} /> فتح الصورة الأصلية بدقة {imageSize}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-40 h-40 bg-white rounded-[3rem] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-700">
                    <ImageIcon size={80} className="text-slate-100" />
                  </div>
                  <div className="text-center px-12">
                    <p className="font-black text-2xl text-slate-300 mb-2">نافذة على طموحك</p>
                    <p className="text-slate-200 font-bold text-xs leading-relaxed">اكتب وصفاً لهدفك المالي وسيقوم الذكاء الاصطناعي برسمه لك ليكون حافزاً بصرياً في رحلتك.</p>
                  </div>
                </>
              )}
            </div>
            
            {imageUrl && !loading && (
              <div className="mt-8 p-8 bg-gradient-to-l from-[#00509d] to-[#002e63] rounded-[3rem] text-white flex items-center gap-6 animate-in slide-in-from-bottom-4 shadow-xl">
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center shrink-0 border border-white/10">
                  <Sparkles size={32} className="text-[#00a896]" />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1 italic">"الرؤية هي نصف التحقيق"</h4>
                  <p className="text-blue-200 text-xs font-bold leading-relaxed opacity-80">احتفظ بهذه الصورة، واجعلها دافعك اليومي للادخار والاستثمار الذكي عبر منصة نماء.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NamaaVisualizer;
