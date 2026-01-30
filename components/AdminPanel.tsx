
import React, { useState } from 'react';
import { Quote } from '../types';
import { ArrowRight, Plus, Trash2, Save, AlertCircle, Quote as QuoteIcon } from 'lucide-react';

interface Props {
  quotes: Quote[];
  setQuotes: (quotes: Quote[]) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<Props> = ({ quotes, setQuotes, onBack }) => {
  const [newQuoteText, setNewQuoteText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addQuote = () => {
    if (!newQuoteText.trim()) {
      setError('لا يمكن إضافة عبارة فارغة');
      return;
    }
    const newQuote: Quote = {
      id: Math.random().toString(36).substr(2, 9),
      text: newQuoteText.trim()
    };
    const updatedQuotes = [...quotes, newQuote];
    setQuotes(updatedQuotes);
    localStorage.setItem('namaa_quotes', JSON.stringify(updatedQuotes));
    setNewQuoteText('');
    setError(null);
  };

  const removeQuote = (id: string) => {
    const updatedQuotes = quotes.filter(q => q.id !== id);
    setQuotes(updatedQuotes);
    localStorage.setItem('namaa_quotes', JSON.stringify(updatedQuotes));
  };

  return (
    <div className="animate-in fade-in slide-in-from-left duration-500 max-w-3xl mx-auto pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-bold group">
        <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>العودة للوحة التحكم</span>
      </button>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
            <QuoteIcon size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">إدارة العبارات التحفيزية</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">تتحكم هذه العبارات فيما يظهر للمستخدمين في الشريط العلوي</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Add New Quote */}
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest mr-2">إضافة عبارة جديدة</label>
            <div className="flex gap-3">
              <input 
                type="text"
                className="flex-grow px-6 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-slate-900 outline-none transition-all font-bold text-slate-900"
                placeholder="اكتب العبارة هنا..."
                value={newQuoteText}
                onChange={(e) => setNewQuoteText(e.target.value)}
              />
              <button 
                onClick={addQuote}
                className="px-8 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                <span>إضافة</span>
              </button>
            </div>
            {error && (
              <div className="mt-3 text-red-500 text-xs font-bold flex items-center gap-2 mr-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>

          {/* List of Quotes */}
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 mr-2">العبارات الحالية ({quotes.length})</h3>
            {quotes.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">لا توجد عبارات حالياً. ابدأ بإضافة واحدة!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {quotes.map((quote) => (
                  <div key={quote.id} className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all">
                    <p className="font-bold text-slate-700">{quote.text}</p>
                    <button 
                      onClick={() => removeQuote(quote.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
