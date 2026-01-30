
import React from 'react';
import { ArrowRight, Target, Eye, Send, Users, ShieldCheck, TrendingUp, Lightbulb, GraduationCap, MapPin } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  onBack: () => void;
}

const AboutNamaa: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-left duration-500 max-w-4xl mx-auto pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-bold group">
        <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>العودة للرئيسية</span>
      </button>

      <div className="text-center mb-16">
        <div className="inline-block p-4 bg-white rounded-full shadow-sm border border-slate-100 mb-6">
          <Logo size="md" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">ما هي منصة نماء؟</h2>
        <p className="text-slate-500 font-bold max-w-2xl mx-auto leading-loose text-lg">
          نماء هي منصة تقنية مالية (FinTech) سعودية رائدة، تهدف إلى تمكين الأفراد من إدارة حياتهم المالية بذكاء وسهولة من خلال دمج تقنيات الذكاء الاصطناعي مع أفضل الممارسات المالية.
        </p>
      </div>

      {/* Pride Section - Taibah University */}
      <div className="mb-16 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00509d] to-[#00a896] rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-[#00509d] to-[#002e63] text-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-xl">
            <GraduationCap size={48} />
          </div>
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3 justify-center md:justify-start">
              بأيدي وطنية مبدعة
              <MapPin size={20} className="text-[#00a896]" />
            </h3>
            <p className="text-slate-600 font-bold leading-relaxed text-lg">
              نفخر بأن منصة "نماء" صُممت وطُورت بالكامل <span className="text-[#00509d]">بأيادي سعوديات مبدعات ومتميزات</span> <span className="text-[#00a896]">جامعة طيبة في المدينة المنورة</span>. انطلقنا من طيبة الطيبة لنساهم في نمو وازدهار الوطن المالي.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Vision Card */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
            <Eye size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">رؤيتنا</h3>
          <p className="text-slate-500 font-medium leading-loose">
            أن نكون الرفيق المالي الأول للمواطن السعودي، والمساهم الأبرز في رفع مستوى الثقافة المالية والادخارية بما يتماشى مع مستهدفات رؤية المملكة 2030.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
            <Send size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4">رسالتنا</h3>
          <p className="text-slate-500 font-medium leading-loose">
            تبسيط عالم المال والاستثمار المعقد وتحويله إلى رحلة ممتعة وآمنة، من خلال أدوات تقنية متطورة تساعدك على بناء ثروتك وتأمين مستقبلك.
          </p>
        </div>
      </div>

      {/* Goals Section */}
      <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden mb-16">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
        <h3 className="text-2xl font-black mb-10 text-center relative z-10">أهدافنا الاستراتيجية</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Lightbulb className="text-yellow-400" />
            </div>
            <h4 className="font-bold mb-2">نشر الوعي</h4>
            <p className="text-xs text-slate-400 font-medium">تثقيف المجتمع حول أسس الإدارة المالية السليمة.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10">
              <TrendingUp className="text-emerald-400" />
            </div>
            <h4 className="font-bold mb-2">تمكين الاستثمار</h4>
            <p className="text-xs text-slate-400 font-medium">تسهيل الوصول للمنصات الاستثمارية المرخصة والآمنة.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10">
              <ShieldCheck className="text-blue-400" />
            </div>
            <h4 className="font-bold mb-2">الأمان المالي</h4>
            <p className="text-xs text-slate-400 font-medium">مساعدة الأفراد في بناء صناديق طوارئ تحميهم من التقلبات.</p>
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/3">
          <div className="w-24 h-24 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mx-auto border-4 border-slate-100">
            <Users size={48} />
          </div>
        </div>
        <div className="w-full md:w-2/3 text-right">
          <h3 className="text-2xl font-black text-slate-900 mb-4">الفئة المستهدفة</h3>
          <ul className="space-y-4">
            {[
              "الشباب الطموح الراغب في بناء مستقبله المالي.",
              "الموظفين الباحثين عن إدارة أفضل لمداخيلهم الشهرية.",
              "المبتدئين في عالم الاستثمار الذين يحتاجون لتوجيه آمن.",
              "كل من يسعى لتحقيق التوازن بين الاستهلاك والادخار."
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 font-bold">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutNamaa;
