
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRight, CheckCircle2, ChevronLeft, Target, Shield, Rocket, Sparkles, BrainCircuit, Wallet, TrendingUp, HelpCircle, Trophy, Lightbulb } from 'lucide-react';

interface Props {
  user: User | null;
  setUser: (user: User) => void;
  onBack: () => void;
}

type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    score: number;
    description?: string;
  }[];
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 'income',
    text: 'ما هو وضع دخلك المالي حالياً؟',
    options: [
      { label: 'ليس لدي دخل ثابت حالياً', score: 1 },
      { label: 'أعتمد على عمل حر أو مكافأة غير منتظمة', score: 2 },
      { label: 'لدي دخل ثابت (راتب شهري)', score: 3 }
    ]
  },
  {
    id: 'knowledge',
    text: 'هل تعرف الفرق الجوهري بين الادخار والاستثمار؟',
    options: [
      { label: 'ليس لدي فكرة واضحة', score: 1 },
      { label: 'أعرف الفرق البسيط ولكني لا أمارس أي منهما', score: 2 },
      { label: 'أعرف الفرق جيداً وأطبق استراتيجيات لكل منهما', score: 3 }
    ]
  },
  {
    id: 'budgeting',
    text: 'ما هي تجربتك مع وضع ميزانية شخصية؟',
    options: [
      { label: 'لم أجرب ذلك أبداً', score: 1 },
      { label: 'حاولت سابقاً ولكني لا ألتزم بها دائماً', score: 2 },
      { label: 'ألتزم بميزانية دقيقة وأسجل كل مصروفاتي', score: 3 }
    ]
  },
  {
    id: 'challenge',
    text: 'ما هو أكبر تحدي يواجهك في إدارة أموالك؟',
    options: [
      { label: 'ضعف الدخل وصعوبة تغطية الاحتياجات', score: 1 },
      { label: 'كثرة المغريات الاستهلاكية وعدم السيطرة على الصرف', score: 2 },
      { label: 'لا أعرف أين أو كيف أبدأ الاستثمار', score: 3 }
    ]
  },
  {
    id: 'emergency',
    text: 'هل تملك "مصد مالي" (مبلغ للطوارئ يغطي 3 أشهر)؟',
    options: [
      { label: 'لا أملك أي مدخرات للطوارئ', score: 1 },
      { label: 'بدأت في بناء الصندوق ولكنه غير مكتمل', score: 2 },
      { label: 'نعم، لدي صندوق طوارئ مكتمل ومنفصل', score: 3 }
    ]
  },
  {
    id: 'investing',
    text: 'ما هو مستواك الفعلي في عالم الاستثمار؟',
    options: [
      { label: 'لم أستثمر أبداً وأخشى المخاطرة', score: 1 },
      { label: 'لدي محفظة صغيرة أو أفكر في البدء قريباً', score: 2 },
      { label: 'مستثمر نشط وأملك محفظة متنوعة', score: 3 }
    ]
  }
];

const FinancialJourney: React.FC<Props> = ({ user, setUser, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(!!user?.financialStage);

  const handleOptionSelect = (score: number) => {
    const questionId = ASSESSMENT_QUESTIONS[currentQuestionIndex].id;
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);

    if (currentQuestionIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, number>) => {
    const totalScore = Object.values(finalAnswers).reduce((sum, s) => sum + s, 0);
    let stage = 1; // Beginner
    if (totalScore > 14) stage = 3; // Advanced
    else if (totalScore > 8) stage = 2; // Intermediate

    if (user) {
      const updatedUser = { ...user, financialStage: stage };
      setUser(updatedUser);
      localStorage.setItem('namaa_user', JSON.stringify(updatedUser));
    }
    setIsCompleted(true);
  };

  const resetAssessment = () => {
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const getLevelInfo = (): { 
    name: string; 
    icon: React.ReactNode; 
    desc: string; 
    tasks: string[]; 
    nextStep: string; 
    color: string;
    bg: string;
  } => {
    switch (user?.financialStage) {
      case 3:
        return {
          name: 'المستوى المتقدم (خبير النمو)',
          icon: <Rocket className="w-12 h-12" />,
          desc: 'لقد تجاوزت مرحلة الأمان المالي، أنت الآن في مرحلة بناء الثروة الحقيقية وجعل المال يعمل لأجلك.',
          tasks: [
            'مراجعة تنويع المحفظة الاستثمارية دورياً.',
            'تحسين التكلفة الضريبية والزكوية للاستثمارات.',
            'البحث عن فرص استثمارية جريئة أو عقارية.',
            'العمل على تحقيق دخل سلبي يغطي 50% من مصاريفك.'
          ],
          nextStep: 'تحقيق الاستقلال المالي الكامل والبدء في بناء الأثر المالي المستدام.',
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        };
      case 2:
        return {
          name: 'المستوى المتوسط (مدير الميزانية)',
          icon: <Shield className="w-12 h-12" />,
          desc: 'لديك وعي مالي جيد، والآن هدفك هو تحصين ميزانيتك وبناء درع يحميك من أي تقلبات مفاجئة.',
          tasks: [
            'إكمال بناء صندوق الطوارئ (6 أشهر من المصاريف).',
            'خفض المصاريف الكمالية بنسبة 15% إضافية.',
            'البدء بالادخار التلقائي (Automatic Savings).',
            'دراسة أساسيات سوق الأسهم والصناديق الاستثمارية.'
          ],
          nextStep: 'الوصول لمرحلة الفائض المالي المستقر والبدء في أول عملية استثمار حقيقية.',
          color: 'text-teal-600',
          bg: 'bg-teal-50'
        };
      default:
        return {
          name: 'المستوى المبتدئ (مرحلة التأسيس)',
          icon: <Target className="w-12 h-12" />,
          desc: 'أنت في أهم مرحلة، مرحلة وضع القواعد. التركيز هنا هو فهم أين تذهب أموالك وبناء عادة الالتزام.',
          tasks: [
            'تسجيل كل ريال يتم صرفه لمدة شهر كامل.',
            'تحديد الفرق بين "الحاجة" و "الرغبة" في كل عملية شراء.',
            'وضع ميزانية بسيطة لا تتجاوز الدخل المتاح.',
            'فتح حساب ادخار فرعي وتسميته "مصد الأمان".'
          ],
          nextStep: 'الالتزام بميزانية شهرية وتحقيق أول فائض مالي (ولو بسيط).',
          color: 'text-orange-600',
          bg: 'bg-orange-50'
        };
    }
  };

  const levelInfo = getLevelInfo();

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-bold group">
        <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>العودة للرئيسية</span>
      </button>

      {!isCompleted ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
              <div 
                className="h-full bg-[#00509d] transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-50 text-[#00509d] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <BrainCircuit size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">تقييم نماء المالي</h2>
              <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">السؤال {currentQuestionIndex + 1} من {ASSESSMENT_QUESTIONS.length}</p>
            </div>

            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-800 text-center leading-relaxed">
                {ASSESSMENT_QUESTIONS[currentQuestionIndex].text}
              </h3>

              <div className="grid gap-4">
                {ASSESSMENT_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option.score)}
                    className="w-full p-6 text-right bg-slate-50 hover:bg-white border-2 border-transparent hover:border-[#00509d] rounded-3xl transition-all group flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-700 group-hover:text-[#00509d]">{option.label}</span>
                    <ChevronLeft size={20} className="text-slate-300 group-hover:text-[#00509d] group-hover:-translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
              هذا التقييم يساعدنا في رسم خارطة طريق<br />تتناسب مع قدراتك وأهدافك الحالية
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Level Header Card */}
          <div className={`relative p-10 md:p-14 rounded-[4rem] overflow-hidden ${levelInfo.bg} border border-white shadow-sm`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className={`w-28 h-28 rounded-[2.5rem] bg-white shadow-xl flex items-center justify-center ${levelInfo.color} shrink-0`}>
                {levelInfo.icon}
              </div>
              <div className="text-center md:text-right">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                  <span className={`px-4 py-1.5 rounded-full bg-white font-black text-[10px] uppercase tracking-widest shadow-sm ${levelInfo.color}`}>
                    مستواك الحالي
                  </span>
                  <Trophy size={20} className={levelInfo.color} />
                </div>
                <h2 className={`text-4xl font-black mb-4 ${levelInfo.color}`}>{levelInfo.name}</h2>
                <p className="text-slate-600 font-bold leading-relaxed max-w-xl">{levelInfo.desc}</p>
              </div>
            </div>
          </div>

          {/* Roadmap Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tasks Card */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                إجراءاتك الموصى بها
              </h3>
              <div className="space-y-4">
                {levelInfo.tasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-200 mt-0.5 shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={14} className="text-[#00a896]" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{task}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Level Card */}
            <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-1000"></div>
              
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <TrendingUp size={20} className="text-[#00a896]" />
                </div>
                مفتاح المرحلة القادمة
              </h3>
              
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm mb-10">
                <p className="text-blue-100 font-bold leading-loose text-lg text-center">
                  « {levelInfo.nextStep} »
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lightbulb size={18} className="text-yellow-400" />
                  <span className="text-xs font-bold text-slate-400">نصيحة نماء للتقدم:</span>
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  الاستمرارية أهم من الكمية. الالتزام البسيط اليومي هو ما يصنع الفوارق المالية الكبيرة على المدى البعيد.
                </p>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="text-center pt-8">
            <button 
              onClick={resetAssessment}
              className="text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mx-auto transition-all"
            >
              <HelpCircle size={14} />
              إعادة إجراء التقييم التشخيصي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialJourney;
