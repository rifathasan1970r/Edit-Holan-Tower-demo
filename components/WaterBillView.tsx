import React from 'react';
import { ArrowLeft, Droplets } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface WaterBillViewProps {
  onBack: () => void;
}

export const WaterBillView: React.FC<WaterBillViewProps> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-500 bg-slate-50 dark:bg-slate-900 min-h-screen relative">
      {/* Navigation Header Section */}
      <div className="bg-white dark:bg-slate-800 sticky top-[var(--header-height)] z-10 border-b border-slate-100 dark:border-slate-700 shadow-sm transition-all">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50 dark:border-slate-700">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-1 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-base font-bold">{t.waterBillView.back}</span>
          </button>
        </div>
        
        <div className="flex items-center justify-center px-6 py-4">
          <div className="text-center animate-in zoom-in duration-300 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-md">
                <Droplets size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t.waterBillView.title}</h2>
                <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {t.waterBillView.subtitle}
                </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-center">{t.waterBillView.comingSoon}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">{t.waterBillView.description}</p>
        </div>
      </div>
    </div>
  );
};
