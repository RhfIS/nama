
import React, { useState, useEffect } from 'react';
import { User, AppStep, ExpenseItem, Quote } from './types';
import { Logo } from './components/Logo';
// Added 'TrendingUp' to the imports to fix the missing name error on line 303
import { LogOut, ChevronRight, Settings2, AlertCircle, Map, Sparkles, PlusCircle, XCircle, Phone, ShieldCheck, Loader2, TrendingUp } from 'lucide-react';
import { SavingsJarIcon } from './components/Icons';
import { sendOTP, verifyOTP, checkAuthSession, deleteCookie } from './services/authService';
import SavingsTool from './components/SavingsTool';
import InvestmentTool from './components/InvestmentTool';
import ConsultationBot from './components/ConsultationBot';
import FinancialJourney from './components/FinancialJourney';
import AboutNamaa from './components/AboutNamaa';
import MotivationalBanner from './components/MotivationalBanner';
import NamaaVisualizer from './components/NamaaVisualizer';

const INITIAL_QUOTES: Quote[] = [
  { id: '1', text: 'الثروة ليست في كثرة العرض، بل في حسن التدبير' },
  { id: '2', text: 'نماء: رحلتك من الادخار البسيط إلى الاستثمار الذكي' },
  { id: '3', text: 'اجعل مالك يعمل لأجلك، ابدأ خطتك اليوم' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<AppStep>(AppStep.LOGIN);
  const [phone, setPhone] = useState('05');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [income, setIncome] = useState<number | ''>('');
  const [expenseList, setExpenseList] = useState<ExpenseItem[]>([]);
  const [quotes] = useState<Quote[]>(INITIAL_QUOTES);
  
  const [tempExpenseName, setTempExpenseName] = useState('');
  const [tempExpenseAmount, setTempExpenseAmount] = useState<number | ''>('');

  // فحص الجلسة عند التشغيل
  useEffect(() => {
    const initAuth = async () => {
      // Cast 'firebaseUser' to any to avoid 'unknown' property access errors
      const firebaseUser: any = await checkAuthSession();
      if (firebaseUser) {
        const savedUser = localStorage.getItem('namaa_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setIncome(parsed.income || 0);
          setExpenseList(parsed.expenseDetails || []);
          setStep(AppStep.DASHBOARD);
        } else {
          // إذا كان مسجل في فايربيس لكن لا يوجد بيانات محلية
          setUser({
            id: firebaseUser.uid,
            name: "مستخدم نماء",
            identity: firebaseUser.phoneNumber || "",
            income: 0,
            expenses: 0
          });
          setStep(AppStep.FINANCIAL_DATA);
        }
      }
    };
    initAuth();
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^05\d{8}$/.test(phone)) {
      setError('يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05');
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+966${phone.substring(1)}`;
      await sendOTP(formattedPhone);
      setIsOtpSent(true);
    } catch (err) {
      setError('فشل إرسال الرمز. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError('الرمز يجب أن يتكون من 6 أرقام');
      return;
    }

    setLoading(true);
    try {
      const firebaseUser = await verifyOTP(otp);
      const newUser: User = {
        id: firebaseUser.uid,
        name: "مستثمر نماء",
        identity: phone,
        income: 0,
        expenses: 0,
        expenseDetails: []
      };
      setUser(newUser);
      setStep(AppStep.FINANCIAL_DATA);
    } catch (err) {
      setError('رمز التحقق غير صحيح، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    deleteCookie('auth_token');
    localStorage.removeItem('namaa_user');
    // Safely access firebase on window to avoid TypeScript error
    (window as any).firebase.auth().signOut();
    setUser(null);
    setStep(AppStep.LOGIN);
    setPhone('05');
    setOtp('');
    setIsOtpSent(false);
  };

  const addNewExpense = () => {
    if (tempExpenseName.trim() && tempExpenseAmount !== '' && tempExpenseAmount > 0) {
      const newExpense: ExpenseItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: tempExpenseName,
        amount: Number(tempExpenseAmount)
      };
      setExpenseList([...expenseList, newExpense]);
      setTempExpenseName('');
      setTempExpenseAmount('');
    }
  };

  const removeExpense = (id: string) => {
    setExpenseList(expenseList.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-right overflow-x-hidden" dir="rtl">
      <MotivationalBanner quotes={quotes} />

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="sm" />
          {user && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[10px] font-black text-[#00509d] uppercase tracking-widest">المستثمر</span>
                <span className="text-sm font-bold text-slate-900">{user.name}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
        {step === AppStep.LOGIN && (
          <div className="max-w-md mx-auto animate-in fade-in zoom-in duration-700 mt-10">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 gradient-taibah"></div>
              
              <div className="flex flex-col items-center mb-10">
                <Logo size="lg" />
                <p className="text-slate-400 font-bold text-xs mt-6 uppercase tracking-[0.2em]">توثيق الدخول الآمن</p>
              </div>

              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 mr-2">رقم الجوال السعودي</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 border-r pr-3">
                        <span className="text-xs font-bold">+966</span>
                      </div>
                      <input 
                        type="tel"
                        required
                        className="w-full pl-20 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00509d] outline-none transition-all font-bold text-lg tracking-widest"
                        placeholder="05XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').substring(0, 10))}
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 gradient-taibah text-white font-black rounded-2xl shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                    أرسل رمز التحقق
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in slide-in-from-bottom-4">
                  <div className="text-center">
                    <p className="text-slate-500 text-sm font-bold mb-2">أدخل الرمز المرسل إلى</p>
                    <p className="text-[#00509d] font-black tracking-widest" dir="ltr">{phone}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-center gap-2" dir="ltr">
                      <input 
                        type="text"
                        maxLength={6}
                        className="w-full text-center py-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00509d] outline-none transition-all font-black text-3xl tracking-[0.5em]"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setIsOtpSent(false); setOtp(''); }}
                      className="w-full text-xs font-black text-slate-400 hover:text-[#00509d] transition-colors"
                    >
                      تغيير رقم الجوال؟
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : null}
                    تأكيد الدخول
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {step === AppStep.DASHBOARD && (
          <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00509d] to-[#00a896] rounded-[3.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
              <div className="relative bg-[#002e63] p-10 md:p-14 rounded-[3.5rem] text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="text-center md:text-right">
                    <h2 className="text-4xl font-black mb-4 flex items-center gap-3 justify-center md:justify-start">
                      مرحباً، {user?.name}
                      <Sparkles className="text-[#00a896]" />
                    </h2>
                    <p className="text-slate-400 font-bold mb-8">إليك ملخص محفظتك المالية لليوم</p>
                    
                    <div className="flex wrap gap-4 justify-center md:justify-start">
                      <button onClick={() => setStep(AppStep.JOURNEY)} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all font-bold text-sm flex items-center gap-2">
                        <Map size={18} /> رحلة النمو
                      </button>
                      <button onClick={() => setStep(AppStep.FINANCIAL_DATA)} className="px-6 py-3 bg-blue-500/20 text-[#00a896] hover:bg-blue-500/30 rounded-2xl border border-blue-500/20 transition-all font-bold text-sm flex items-center gap-2">
                        <Settings2 size={18} /> تحديث الميزانية
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-6 w-full md:w-auto">
                    <div className="flex-1 md:w-48 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">الدخل الشهري</p>
                      <p className="text-3xl font-black">{user?.income.toLocaleString()} <span className="text-xs font-bold opacity-50">ر.س</span></p>
                    </div>
                    <div className="flex-1 md:w-48 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">المصروفات</p>
                      <p className="text-3xl font-black text-red-400">{user?.expenses.toLocaleString()} <span className="text-xs font-bold opacity-50">ر.س</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: AppStep.SAVINGS, icon: <SavingsJarIcon size={32} />, title: "حصالة نماء", desc: "قسم أهدافك لمدخرات بسيطة.", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                { step: AppStep.VISUALIZER, icon: <Sparkles size={32} />, title: "مخيلة نماء", desc: "حوّل أهدافك لصور ملهمة.", color: "bg-blue-50 text-[#00509d] border-blue-100" },
                { step: AppStep.INVESTMENT, icon: <TrendingUp size={32} />, title: "فرص الاستثمار", desc: "استكشف المنصات المرخصة.", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
                { step: AppStep.CONSULTATION, icon: <Sparkles size={32} />, title: "مستشار نماء", desc: "مستشارك الذكي جاهز لك.", color: "bg-slate-50 text-slate-600 border-slate-100" }
              ].map((card, idx) => (
                <button 
                  key={idx}
                  onClick={() => setStep(card.step)}
                  className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-right flex flex-col h-full bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 ${card.color}`}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-500 font-bold text-xs leading-relaxed mb-6">{card.desc}</p>
                  <div className="mt-auto flex items-center gap-2 text-slate-900 font-black text-[10px] justify-end">
                    ابدأ الآن <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === AppStep.FINANCIAL_DATA && (
          <div className="max-w-3xl mx-auto">
             <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">بناء ملفك المالي</h2>
                
                <div className="space-y-10">
                  <div className="p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#00a896]/5 rounded-bl-full -mr-8 -mt-8"></div>
                    <label className="block text-sm font-black text-slate-400 mb-4 uppercase tracking-widest">الدخل الشهري (ريال)</label>
                    <input 
                      type="number"
                      min="0"
                      required
                      className="w-full text-5xl font-black text-center bg-transparent outline-none text-[#00509d] placeholder:opacity-20"
                      placeholder="0"
                      value={income}
                      onChange={(e) => setIncome(e.target.value === '' ? '' : Math.abs(Number(e.target.value)))}
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                      <h3 className="text-lg font-black text-slate-900">المصروفات الشهرية</h3>
                      <span className="text-[10px] font-black bg-red-50 text-red-500 px-3 py-1 rounded-full border border-red-100">
                        الإجمالي: {expenseList.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} ر.س
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 items-end">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-black text-slate-400 mb-2 mr-2">اسم المصروف</label>
                        <input 
                          type="text"
                          className="w-full px-5 py-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-[#00a896] font-bold text-sm"
                          placeholder="أدخل الوصف"
                          value={tempExpenseName}
                          onChange={(e) => setTempExpenseName(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-black text-slate-400 mb-2 mr-2">المبلغ</label>
                        <input 
                          type="number"
                          className="w-full px-5 py-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-[#00a896] font-bold text-sm"
                          placeholder="0"
                          value={tempExpenseAmount}
                          onChange={(e) => setTempExpenseAmount(e.target.value === '' ? '' : Math.abs(Number(e.target.value)))}
                        />
                      </div>
                      <button 
                        onClick={addNewExpense}
                        disabled={!tempExpenseName.trim() || tempExpenseAmount === ''}
                        className="w-full py-3 bg-[#00a896] text-white rounded-xl font-black text-sm shadow-md hover:bg-teal-600 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                      >
                        <PlusCircle size={18} /> إضافة
                      </button>
                    </div>

                    <div className="space-y-3 px-2">
                      {expenseList.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <div>
                            <p className="font-bold text-slate-700">{item.name}</p>
                            <p className="text-[10px] font-black text-slate-400">{item.amount.toLocaleString()} ر.س</p>
                          </div>
                          <button onClick={() => removeExpense(item.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                            <XCircle size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if(income !== '' && income > 0) {
                        const totalExpenses = expenseList.reduce((s,i)=>s+i.amount, 0);
                        const updatedUser = { ...user!, income: Number(income), expenses: totalExpenses, expenseDetails: expenseList };
                        setUser(updatedUser);
                        localStorage.setItem('namaa_user', JSON.stringify(updatedUser));
                        setStep(AppStep.DASHBOARD);
                      }
                    }}
                    disabled={income === '' || income <= 0}
                    className="w-full py-5 gradient-taibah text-white font-black rounded-3xl text-xl shadow-lg transition-all disabled:opacity-50"
                  >
                    حفظ الملف المالي
                  </button>
                </div>
             </div>
          </div>
        )}

        {step === AppStep.SAVINGS && <SavingsTool user={user} onBack={() => setStep(AppStep.DASHBOARD)} />}
        {step === AppStep.INVESTMENT && <InvestmentTool income={user?.income || 0} expenses={user?.expenses || 0} onBack={() => setStep(AppStep.DASHBOARD)} />}
        {step === AppStep.CONSULTATION && <ConsultationBot onBack={() => setStep(AppStep.DASHBOARD)} />}
        {step === AppStep.JOURNEY && <FinancialJourney user={user} setUser={setUser} onBack={() => setStep(AppStep.DASHBOARD)} />}
        {step === AppStep.ABOUT && <AboutNamaa onBack={() => setStep(AppStep.DASHBOARD)} />}
        {step === AppStep.VISUALIZER && <NamaaVisualizer onBack={() => setStep(AppStep.DASHBOARD)} />}
      </main>

      <footer className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row-reverse justify-between items-center gap-8">
          <Logo size="sm" />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2025 نماء المالية - جميع الحقوق محفوظة</p>
          <div className="flex gap-8 text-[10px] font-black text-slate-400">
             <a href="#" onClick={(e) => {e.preventDefault(); setStep(AppStep.ABOUT);}} className="hover:text-[#00a896] transition-colors">عن نماء</a>
             <a href="#" className="hover:text-[#00a896] transition-colors">اتصل بنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
