
import React, { useState, useEffect } from 'react';
import { INVESTMENT_PLATFORMS } from '../constants';
import { ArrowRight, ExternalLink, Sparkles, Loader2, Info, ChevronDown, ChevronUp, Gauge } from 'lucide-react';
import { getInvestmentAdvice } from '../services/geminiService';

interface Props {
  onBack: () => void;
  income: number;
  expenses: number;
}

const InvestmentTool: React.FC<Props> = ({ onBack, income, expenses }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const text = await getInvestmentAdvice(income, expenses);
        setAdvice(text || '1. - نوصي دائماً باستثمار ما لا يقل عن 10% من الدخل الفائض شهرياً.');
      } catch (err) {
        setAdvice('حدث خطأ أثناء جلب النصيحة. يرجى مراجعة بياناتك المالية والمحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvice();
  }, [income, expenses]);

  const togglePlatform = (name: string) => {
    setExpandedPlatform(expandedPlatform === name ? null : name);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'VERY_EASY': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'EASY': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'MEDIUM': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'ADVANCED': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'HARD': return 'bg-red-50 text-red-600 border-red-100';
      case 'VERY_HARD': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="animate-in slide-in-from-left duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors font-bold">
        <ArrowRight size={20} />
        <span>العودة للرئيسية</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">منصات استثمارية مرخصة في المملكة العربية السعودية</h2>
            <p className="text-slate-500 mb-10 font-medium text-sm">تم تصنيف المنصات من حيث سهولة الاستخدام والحاجة للخبرة في التحليل المالي.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INVESTMENT_PLATFORMS.map((platform, idx) => (
                <div key={idx} className="p-6 rounded-3xl border border-slate-100 hover:border-slate-300 bg-white shadow-sm hover:shadow-md transition-all flex flex-col group border-r-4 border-r-slate-900 relative">
                  <div className="flex justify-between items-start mb-4 gap-2 flex-wrap">
                    <span className="text-[10px] font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-widest">
                      {platform.type}
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(platform.difficulty)}`}>
                      <Gauge size={12} />
                      {platform.difficultyLabel}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    {/* Removed the logo square/avatar block */}
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{platform.name}</h3>
                  </div>
                  
                  <button 
                    onClick={() => togglePlatform(platform.name)}
                    className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-4 hover:text-slate-900 transition-colors"
                  >
                    <Info size={14} />
                    <span>نبذة عن المنصة</span>
                    {expandedPlatform === platform.name ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {expandedPlatform === platform.name && (
                    <div className="mb-4 text-sm text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {platform.description}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <a 
                      href={platform.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full text-blue-600 font-bold text-sm group-hover:underline"
                    >
                      <span>زيارة المنصة</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500 rounded-full blur-[100px] opacity-10"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Sparkles className="text-blue-400" size={20} />
              </div>
              <h3 className="font-extrabold text-lg">تحليل المستشار المالي</h3>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <Loader2 className="animate-spin text-blue-400" size={32} />
                <p className="text-slate-400 text-sm font-bold animate-pulse">جاري تحليل بياناتك وحساب الفائض...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-slate-300 leading-loose text-[15px] whitespace-pre-line font-medium">
                  {advice}
                </div>
                
                <div className="pt-6 border-t border-slate-800/50">
                  <div className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-2">المقترح الشهري للاستثمار</div>
                  <div className="text-4xl font-black text-blue-400 tracking-tight">
                    {Math.max(0, Math.round((income - expenses) * 0.4)).toLocaleString()} 
                    <span className="text-sm font-bold text-slate-500 mr-2">ر.س</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-3 font-medium">
                    *هذه القيمة تمثل النسبة الآمنة للاستثمار (40%) من فائض ميزانيتك.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Info size={18} className="text-blue-500" />
              نصيحة للمبتدئين
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              إذا كنت في بداية رحلتك الاستثمارية، ننصحك بالبدء بالمنصات المصنفة كـ <strong>"سهل جداً"</strong> مثل تمرة المالية، حيث تتكفل المنصة بإدارة المخاطر والتنويع بدلاً منك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentTool;
