import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface PolicyViewProps {
  onBack: () => void;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const policies = t.policyView.policies;

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-b-3xl shadow-sm border-b border-slate-100 dark:border-slate-700 mb-6 sticky top-[60px] z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{t.policyView.title}</h2>
            <p className="text-xs text-rose-500 font-medium">{t.policyView.subtitle}</p>
          </div>
          <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400">
            <FileText size={20} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-0 relative">
        <div className="mb-6 px-4">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
            {t.policyView.intro}
          </p>
        </div>

        {/* Vertical Line */}
        <div className="absolute left-8 top-24 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

        {policies.map((policy: string, index: number) => (
          <div key={index} className="relative pl-12 py-4 group">
            {/* Number Bubble */}
            <div className="absolute left-4 top-4 w-8 h-8 -ml-4 bg-white dark:bg-slate-900 border-2 border-rose-500 text-rose-500 rounded-full flex items-center justify-center text-xs font-bold z-10 shadow-sm group-hover:scale-110 transition-transform">
              {index + 1}
            </div>
            
            {/* Content Card */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:border-rose-200 dark:group-hover:border-rose-900/50 transition-colors">
               <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                  {policy}
               </p>
            </div>
          </div>
        ))}

        <div className="mt-8 p-6 bg-gradient-to-br from-rose-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-rose-100 dark:border-slate-700 text-center relative z-10">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-3">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{t.policyView.thanks}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.policyView.footer}
          </p>
        </div>
      </div>
    </div>
  );
};
