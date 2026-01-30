
import React, { useState, useEffect } from 'react';
import { User, SavingsGoal } from '../types';
import { ArrowRight, CheckCircle2, Trophy, Trash2, Calendar, Target, Layers } from 'lucide-react';
import { SavingsJarIcon } from './Icons';

interface Props {
  onBack: () => void;
  user: User | null;
}

const SavingsTool: React.FC<Props> = ({ onBack, user }) => {
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [savingsType, setSavingsType] = useState<'FIXED' | 'VARIED' | null>(null);
  const [months, setMonths] = useState<number | ''>('');
  const [isStarted, setIsStarted] = useState(false);
  const [goal, setGoal] = useState<SavingsGoal | null>(null);
  const [inputSaving, setInputSaving] = useState<number>(0);

  useEffect(() => {
    const savedGoal = localStorage.getItem(`namaa_goal_${user?.id}`);
    if (savedGoal) {
      setGoal(JSON.parse(savedGoal));
      setIsStarted(true);
    }
  }, [user]);

  const startGoal = () => {
    if (goalAmount <= 0 || !savingsType) return;

    const target = Math.floor(goalAmount);
    // نستخدم عدد الأشهر المدخل كعدد للخانات، وإذا لم يدخل المستفيد نستخدم 10 كافتراضي صامت
    const chunksCount = months && months > 0 ? months : 10;
    let chunks: number[] = [];

    if (savingsType === 'FIXED') {
      const fixedAmount = Math.floor(target / chunksCount);
      for (let i = 0; i < chunksCount - 1; i++) {
        chunks.push(fixedAmount);
      }
      chunks.push(target - (fixedAmount * (chunksCount - 1)));
    } else {
      let currentSum = 0;
      for (let i = 0; i < chunksCount - 1; i++) {
        const remainingAmount = target - currentSum;
        const remainingChunks = chunksCount - i;
        const average = remainingAmount / remainingChunks;
        let val = Math.floor(average * (0.6 + Math.random() * 0.8));
        if (val < 1) val = 1;
        if (currentSum + val > target - (remainingChunks - 1)) val = 1;
        chunks.push(val);
        currentSum += val;
      }
      chunks.push(Math.max(0, target - currentSum));
      chunks.sort((a, b) => a - b);
    }

    const newGoal: SavingsGoal = {
      target,
      saved: 0,
      chunks,
      completedChunks: new Array(chunksCount).fill(false),
      type: savingsType,
      months: months || undefined
    };

    setGoal(newGoal);
    setIsStarted(true);
    localStorage.setItem(`namaa_goal_${user?.id}`, JSON.stringify(newGoal));
  };

  const logSavings = () => {
    if (!goal || inputSaving <= 0) return;

    const amount = Math.floor(inputSaving);
    let updatedChunks = [...goal.chunks];
    let updatedCompleted = [...goal.completedChunks];
    
    // البحث عن مبلغ مطابق تماماً أولاً
    let matchIndex = -1;
    for (let i = 0; i < updatedChunks.length; i++) {
      if (!updatedCompleted[i] && updatedChunks[i] === amount) {
        matchIndex = i;
        break;
      }
    }

    if (matchIndex !== -1) {
      updatedCompleted[matchIndex] = true;
    } else {
      // إذا لم يتطابق، نشطب أول خانة فارغة ونعيد توزيع المتبقي
      const firstEmptyIdx = updatedCompleted.findIndex(c => !c);
      if (firstEmptyIdx === -1) return;

      updatedChunks[firstEmptyIdx] = amount;
      updatedCompleted[firstEmptyIdx] = true;

      const currentActualSaved = updatedChunks.reduce((sum, val, idx) => updatedCompleted[idx] ? sum + val : sum, 0);
      const remainingTarget = goal.target - currentActualSaved;
      const emptyIndices = updatedCompleted.map((c, i) => !c ? i : -1).filter(i => i !== -1);
      
      if (emptyIndices.length > 0) {
        if (remainingTarget <= 0) {
          emptyIndices.forEach(idx => {
            updatedChunks[idx] = 0;
            updatedCompleted[idx] = true;
          });
        } else if (goal.type === 'FIXED') {
          const newAvg = Math.floor(remainingTarget / emptyIndices.length);
          for (let i = 0; i < emptyIndices.length - 1; i++) {
            updatedChunks[emptyIndices[i]] = newAvg;
          }
          updatedChunks[emptyIndices[emptyIndices.length - 1]] = remainingTarget - (newAvg * (emptyIndices.length - 1));
        } else {
          let distributedSum = 0;
          for (let i = 0; i < emptyIndices.length - 1; i++) {
            const idx = emptyIndices[i];
            const remSlots = emptyIndices.length - i;
            const avg = remainingTarget / remSlots;
            let newVal = Math.floor(avg * (0.8 + Math.random() * 0.4));
            if (newVal < 1) newVal = 1;
            updatedChunks[idx] = newVal;
            distributedSum += newVal;
          }
          updatedChunks[emptyIndices[emptyIndices.length - 1]] = Math.max(0, remainingTarget - distributedSum);
        }
      }
    }

    const newSavedTotal = updatedChunks.reduce((sum, val, idx) => updatedCompleted[idx] ? sum + val : sum, 0);
    const updatedGoal = {
      ...goal,
      chunks: updatedChunks,
      completedChunks: updatedCompleted,
      saved: newSavedTotal
    };

    setGoal(updatedGoal);
    localStorage.setItem(`namaa_goal_${user?.id}`, JSON.stringify(updatedGoal));
    setInputSaving(0);
  };

  const resetGoal = () => {
    if (confirm('هل أنت متأكد من حذف الحصالة الحالية؟')) {
      // 1. مسح البيانات من الذاكرة المحلية
      localStorage.removeItem(`namaa_goal_${user?.id}`);
      
      // 2. تصفير الحالات للرجوع تماماً للخطوة الأولى (اختيار النوع والمبلغ)
      setGoal(null);
      setIsStarted(false);
      setGoalAmount(0);
      setSavingsType(null);
      setMonths('');
      setInputSaving(0);
    }
  };

  const progress = goal ? Math.min((goal.saved / goal.target) * 100, 100) : 0;

  return (
    <div className="animate-in slide-in-from-left duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-bold">
        <ArrowRight size={20} />
        <span>العودة للرئيسية</span>
      </button>

      {!isStarted ? (
        <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-300">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <SavingsJarIcon size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">أنشئ حصالتك الرقمية</h2>
            <p className="text-slate-500 mb-10 font-bold">حدد هدفك المالي وسنقوم بتوزيع المبلغ لتسهيل عملية الادخار.</p>
            
            <div className="space-y-8 text-right">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mr-2 mb-3">كم تود أن تدخر؟ (المبلغ المستهدف)</label>
                <input 
                  type="number"
                  className="w-full text-4xl font-black text-center py-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none transition-all shadow-inner"
                  placeholder="0"
                  value={goalAmount || ''}
                  onChange={(e) => setGoalAmount(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setSavingsType('FIXED')}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${savingsType === 'FIXED' ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                >
                  <Calendar size={28} />
                  <span className="font-black">ادخار ثابت</span>
                  <span className="text-[10px] font-bold opacity-70">(مبلغ متساوي كل شهر)</span>
                </button>
                <button 
                  onClick={() => setSavingsType('VARIED')}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${savingsType === 'VARIED' ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                >
                  <Layers size={28} />
                  <span className="font-black">ادخار متنوع</span>
                  <span className="text-[10px] font-bold opacity-70">(مبالغ مختلفة حسب قدرتك)</span>
                </button>
              </div>

              {savingsType && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                  <div className="p-6 bg-orange-50 border border-orange-100 rounded-[2rem] text-right">
                    <label className="block text-xs font-black text-orange-600 uppercase tracking-widest mr-2 mb-3 flex items-center gap-2">
                      <Target size={14} />
                      حدد عدد الأشهر (اختياري)
                    </label>
                    <input 
                      type="number"
                      className="w-full text-2xl font-black text-center py-4 bg-white rounded-2xl border-2 border-orange-200 focus:border-orange-500 outline-none transition-all text-orange-900"
                      placeholder="اختياري"
                      value={months || ''}
                      onChange={(e) => setMonths(e.target.value ? Number(e.target.value) : '')}
                    />
                    <p className="text-[10px] text-orange-400 mt-2 font-bold mr-2">سيتم تقسيم الحصالة بناءً على عدد الأشهر الذي تحدده.</p>
                  </div>
                </div>
              )}

              <button 
                onClick={startGoal}
                disabled={!savingsType || goalAmount <= 0}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl text-xl shadow-2xl hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-20 disabled:grayscale"
              >
                ابدأ رحلة الادخار
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <SavingsJarIcon size={24} className="text-slate-900" />
                    حصالتك الرقمية ({goal?.type === 'FIXED' ? 'ثابتة' : 'متنوعة'})
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-slate-900">{goal?.saved.toLocaleString()}</span>
                  <span className="text-slate-300 font-bold mx-1">/</span>
                  <span className="text-xl text-slate-400 font-bold">{goal?.target.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-8 shadow-inner">
                <div 
                  className="h-full bg-slate-900 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-1 max-h-[500px] overflow-y-auto custom-scrollbar">
                {goal?.chunks.map((chunk, idx) => (
                  <div 
                    key={idx}
                    className={`
                      relative p-4 rounded-2xl text-center font-black text-sm transition-all duration-500 border
                      ${goal.completedChunks[idx] 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 line-through opacity-40 scale-95 shadow-inner' 
                        : 'bg-white text-slate-700 border-slate-100 hover:border-slate-900 shadow-sm'}
                    `}
                  >
                    {chunk.toLocaleString()}
                    {goal.completedChunks[idx] && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={resetGoal}
              className="w-full p-6 bg-red-50 text-red-600 border border-red-100 rounded-[2rem] font-black text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-3"
            >
              <Trash2 size={18} />
              بدء حصالة جديدة وحذف الحالية
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <h3 className="text-lg font-black text-slate-900 mb-4">تسجيل ادخار جديد</h3>
              <p className="text-sm text-slate-500 mb-6 font-bold leading-relaxed">أدخل المبلغ الذي ادخرته اليوم ليتم شطبه من حصالتك.</p>
              <div className="relative mb-6">
                <input 
                  type="number"
                  className="w-full px-4 py-6 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-center text-4xl font-black shadow-inner"
                  value={inputSaving || ''}
                  placeholder="0.00"
                  onChange={(e) => setInputSaving(Number(e.target.value))}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">ريال</span>
              </div>
              <button 
                onClick={logSavings}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95"
              >
                تحديث الحصالة
              </button>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <Trophy className="absolute -bottom-4 -right-4 opacity-10 rotate-12" size={120} />
              <div className="relative z-10">
                <h4 className="font-black text-sm text-slate-500 uppercase tracking-widest mb-2">المتبقي للهدف</h4>
                <p className="text-5xl font-black mb-2 tracking-tight">
                  {goal ? Math.max(0, goal.target - goal.saved).toLocaleString() : 0} 
                  <span className="text-sm font-bold text-slate-500 mr-2">ر.س</span>
                </p>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-6">
                  <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsTool;
