import React from 'react';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { EMERGENCY_NOTICE_TEXT } from '../../constants';

interface EmergencyNoticeDetailViewProps {
  onBack: () => void;
}

export const EmergencyNoticeDetailView: React.FC<EmergencyNoticeDetailViewProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">জরুরী নোটিশ</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
          <AlertTriangle size={24} />
          <h3 className="font-bold text-lg">গুরুত্বপূর্ণ তথ্য</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {EMERGENCY_NOTICE_TEXT}
        </p>
      </div>
    </div>
  );
};
