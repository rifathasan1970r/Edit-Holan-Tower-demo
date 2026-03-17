import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, Zap, Filter, Check, Copy, Hash, ExternalLink, ShieldCheck, Lightbulb, ChevronRight, X, User, Info, CreditCard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState } from '../types';
import { FLAT_OWNERS as DESCO_DATA } from '../constants';
import { useLanguage } from '../lib/LanguageContext';

// Constants
const EKPAY_LINK = "https://ekpay.gov.bd/#/payment/electricity-bill";
const BLOG_LINK = "https://holantower.blogspot.com/p/holantower-electricity-desco-bill.html";

// Quick Recharge Modal Component
const QuickRechargeModal = ({ onClose, data }: { onClose: () => void, data: typeof DESCO_DATA }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof DESCO_DATA[0] | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const filtered = data.filter(d => 
    (d.flat + " " + d.name).toLowerCase().includes(search.toLowerCase()) || 
    d.account.includes(search)
  );

  const handleCopyAndPay = () => {
     if(!selected) return;
     navigator.clipboard.writeText(selected.account)
       .then(() => setToastMsg(`${t.descoView.copySuccess}`))
       .catch(() => setToastMsg(t.descoView.copyFail));
     
     setTimeout(() => {
        setToastMsg('');
        window.location.href = EKPAY_LINK;
     }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] font-sans text-[#121212] overflow-y-auto animate-in fade-in duration-300">
       {/* Background */}
       <div className="fixed inset-0 bg-[url('https://i.imghippo.com/files/IxR3498AKE.png')] bg-cover bg-center blur-[2px] z-[-1]" />
       <div className="fixed inset-0 bg-white/10 z-[-1]" />

       <div className="min-h-screen flex items-start justify-center p-[18px] pt-[80px]">
          <div className="w-full max-w-[420px] bg-gradient-to-b from-white to-[#fbfbff] rounded-xl p-[14px] shadow-[0_10px_30px_rgba(60,40,120,0.06)] border border-[#4b2bd8]/5 text-center relative">
             <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 bg-white/50 rounded-full p-1"><X size={20}/></button>
             <h2 className="m-0 text-[17px] font-[800]">{t.descoView.selectFlat}</h2>
             
             {/* Dropdown Toggle */}
             <div className="relative w-full max-w-[360px] mx-auto mt-[10px] text-left">
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between gap-[10px] p-[10px_12px] rounded-[10px] border border-[#5a46c8]/10 bg-gradient-to-r from-white to-[#fbfbff] cursor-pointer font-[800] text-[#111] shadow-[0_6px_16px_rgba(80,60,200,0.04)]"
                >
                   <div className="flex items-center gap-[10px]">
                      <div className="bg-gradient-to-b from-[#6f49ff] to-[#4b2bd8] text-white p-[6px_10px] rounded-[8px] font-[900] text-[13px] min-w-[48px] text-center shadow-[0_8px_20px_rgba(75,43,216,0.12)]">
                        {selected ? selected.flat : '—'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-[#6b6b7a] overflow-hidden text-ellipsis whitespace-nowrap">
                           {selected ? selected.name : t.descoView.noFlatSelected}
                        </div>
                        {selected && <div className="text-[12px] text-[#6b6b7a] font-[700]">{selected.account}</div>}
                      </div>
                   </div>
                   <div className={`w-3 h-3 border-r-2 border-b-2 border-black/35 transform transition-transform ${isOpen ? 'rotate-[225deg]' : 'rotate-45'} ml-[6px] opacity-90`} />
                </button>

                {/* Dropdown List */}
                {isOpen && (
                  <div className="absolute left-0 right-0 mt-[8px] bg-gradient-to-b from-white to-[#fbfbff] rounded-[10px] max-h-[260px] overflow-auto border border-[#5a46c8]/6 shadow-[0_18px_45px_rgba(20,16,60,0.08)] z-50 p-[6px]">
                     <input 
                       autoFocus
                       type="text" 
                       placeholder={t.descoView.searchPlaceholder} 
                       className="w-full p-[8px] m-[6px_0] rounded-[8px] border border-[#503cc8]/6 font-[700] outline-none focus:border-[#6f49ff] text-sm"
                       value={search}
                       onChange={e => setSearch(e.target.value)}
                       onClick={e => e.stopPropagation()}
                     />
                     <div>
                       {filtered.map((item, idx) => (
                         <div 
                           key={idx}
                           onClick={() => { setSelected(item); setIsOpen(false); }}
                           className="flex items-center justify-between gap-[10px] p-[8px_10px] rounded-[8px] cursor-pointer hover:bg-gradient-to-r hover:from-[#f7f6ff] hover:to-[#f1efff] transition-all hover:-translate-y-[1px]"
                         >
                            <div className="flex items-center gap-[10px]">
                               <div className="bg-gradient-to-b from-[#f0e9ff] to-[#f8f6ff] p-[6px_10px] rounded-[8px] font-[900] text-[#111] text-xs">{item.flat}</div>
                               <div>
                                  <div className="font-[800] text-[#111] text-[13px]">{item.name}</div>
                                  <div className="text-[12px] text-[#6b6b7a] font-[700]">{item.account}</div>
                               </div>
                            </div>
                         </div>
                       ))}
                       {filtered.length === 0 && <div className="p-2 text-center text-sm text-slate-400">{t.descoView.noResult}</div>}
                     </div>
                  </div>
                )}
             </div>

             {/* Info Cards */}
             {selected && (
               <div className="animate-in slide-in-from-bottom-2 duration-300">
                 <div className="flex flex-col gap-[8px] justify-center mt-[12px]">
                    <div className="w-full bg-gradient-to-b from-white to-[#fbfbff] rounded-[10px] p-[10px] border border-[#5a46c8]/4 shadow-[0_6px_16px_rgba(80,60,200,0.04)] text-center flex flex-col gap-[6px] items-center justify-center">
                       <div className="text-[12px] text-[#6b6b7a] font-[800]">{t.descoView.flatNumber}</div>
                       <div className="text-[15px] font-[900] mt-[2px]">{selected.flat}</div>
                    </div>
                    <div className="w-full bg-gradient-to-b from-white to-[#fbfbff] rounded-[10px] p-[10px] border border-[#5a46c8]/4 shadow-[0_6px_16px_rgba(80,60,200,0.04)] text-center flex flex-col gap-[6px] items-center justify-center">
                       <div className="text-[12px] text-[#6b6b7a] font-[800]">{t.descoView.ownerName}</div>
                       <div className="text-[15px] font-[900] mt-[2px]">{selected.name}</div>
                    </div>
                    <div className="w-full bg-gradient-to-b from-white to-[#fbfbff] rounded-[10px] p-[10px] border border-[#5a46c8]/4 shadow-[0_6px_16px_rgba(80,60,200,0.04)] text-center flex flex-col gap-[6px] items-center justify-center">
                       <div className="text-[12px] text-[#6b6b7a] font-[800]">{t.descoView.accountNumber}</div>
                       <div className="text-[15px] font-[900] mt-[2px] text-[#6f49ff]">{selected.account}</div>
                    </div>
                 </div>

                 <div className="flex gap-[8px] justify-center mt-[10px]">
                    <button 
                      onClick={handleCopyAndPay}
                      className="w-full p-[12px] rounded-[10px] border-none font-[800] cursor-pointer text-[14px] bg-gradient-to-b from-[#6f49ff] to-[#4b2bd8] text-white shadow-lg active:scale-95 transition-transform"
                    >
                      {t.descoView.recharge}
                    </button>
                 </div>
               </div>
             )}

          </div>
       </div>

       {/* Toast */}
       {toastMsg && (
         <div className="fixed left-1/2 -translate-x-1/2 bottom-[22px] bg-black/85 text-white p-[8px_12px] rounded-[8px] text-[13px] z-[200] whitespace-nowrap">
            {toastMsg}
         </div>
       )}
    </div>,
    document.body
  );
};

interface DescoViewProps {
  setView: (view: ViewState) => void;
}

export const DescoView: React.FC<DescoViewProps> = ({ setView }) => {
  const { t, language: lang } = useLanguage();
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [confirmModalData, setConfirmModalData] = useState<{flat: string, name: string, account: string} | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  // Floating Widget State
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // NEW: Quick Recharge Modal State
  const [showQuickRecharge, setShowQuickRecharge] = useState(false);

  // Grouping Logic
  const filteredData = useMemo(() => {
    return DESCO_DATA.filter(item => {
      const matchSearch = 
        item.flat.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.account.includes(searchTerm);
      
      const floor = item.flat === 'MAIN' ? 'main' : item.flat.replace(/\D/g, '');
      const matchFloor = selectedFloor === '' || floor === selectedFloor;

      return matchSearch && matchFloor;
    });
  }, [searchTerm, selectedFloor]);

  const groupedData = useMemo(() => {
    const groups: Record<string, typeof DESCO_DATA> = {};
    filteredData.forEach(item => {
      let floorKey = item.flat === 'MAIN' ? 'main' : item.flat.replace(/\D/g, '');
      if (!groups[floorKey]) groups[floorKey] = [];
      groups[floorKey].push(item);
    });
    return groups;
  }, [filteredData]);

  const sortedFloors = Object.keys(groupedData).sort((a, b) => {
    if (a === 'main') return 1;
    if (b === 'main') return -1;
    return parseInt(a) - parseInt(b);
  });

  // Handlers
  const handleCopy = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
        console.error('Copy failed', err);
    }
  };

  const handleProceedToPayment = () => {
    if (!confirmModalData) return;
    
    // Copy account number
    navigator.clipboard.writeText(confirmModalData.account);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
      
    // Open EkPay directly in the same window
    window.location.href = EKPAY_LINK;
    
    // Close modal after a short delay
    setTimeout(() => {
      setConfirmModalData(null);
    }, 500);
  };

  const getFloorLabel = (key: string) => {
    if (key === 'main') return t.descoView.mainMeter;
    const floorNum = parseInt(key);
    const bnFloors = ['১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম'];
    if (lang === 'bn' && floorNum <= 10 && floorNum > 0) {
      return `${bnFloors[floorNum - 1]} ${t.descoView.floor}`;
    }
    return `${key}${lang === 'bn' ? 'ম ' + t.descoView.floor : 'th ' + t.descoView.floor}`;
  };

  return (
    <>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-100/40 via-white to-slate-50 dark:from-indigo-900/20 dark:via-slate-900 dark:to-slate-900 pointer-events-none" />
      <div className="fixed -top-20 -right-20 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="px-4 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                    <Zap className="text-yellow-500 fill-yellow-500" size={24} />
                    {t.descoView.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1">
                    {t.descoView.subtitle}
                </p>
            </div>
            {/* Logo Placeholder or Icon */}
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center border border-slate-100 dark:border-slate-700">
                <Lightbulb size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
        </div>

        {/* Quick Access Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
                onClick={() => {
                    setView('DESCO_INFO');
                }}
                className="bg-gradient-to-br from-red-500 to-rose-600 border border-red-400 rounded-2xl p-3 shadow-md hover:shadow-lg transition-all text-left flex flex-col items-start justify-center gap-1 h-20 group active:scale-95 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none"></div>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform relative z-10 shrink-0 icon-premium-pulse">
                    <Info size={18} />
                </div>
                <span className="text-[10px] font-bold text-white leading-tight relative z-10 mt-1">
                    {t.descoView.infoBox}
                </span>
            </button>
            <button 
                onClick={() => setView('DESCO_RULES')}
                className="bg-gradient-to-br from-red-500 to-rose-600 border border-red-400 rounded-2xl p-3 shadow-md hover:shadow-lg transition-all text-right flex flex-col items-end justify-center h-20 group active:scale-95 relative overflow-hidden"
            >
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform relative z-10 mb-1 icon-premium-pulse">
                    <Zap size={18} />
                </div>
                <span className="text-[10px] font-bold text-white leading-tight relative z-10">
                    {t.descoView.rulesBox}
                </span>
            </button>
        </div>

        {/* Search & Filter Bar - Fixed: Added background and padding to mask content behind */}
        <div className="sticky top-[var(--header-height)] z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md py-2 -mx-4 px-4 mb-2 transition-all shadow-sm">
            <div className="flex gap-3">
                <div className="relative flex-1 group shadow-lg shadow-slate-200/50 dark:shadow-none rounded-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={t.common.search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 h-10"
                    />
                </div>
                <div className="relative w-[32%] shadow-lg shadow-slate-200/50 dark:shadow-none rounded-2xl">
                    <select 
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        className="w-full bg-indigo-600 border border-indigo-500 text-white font-bold text-xs h-10 rounded-2xl px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-center"
                    >
                        <option value="" className="text-slate-800 bg-white">{t.descoView.allFloors}</option>
                        {[2,3,4,5,6,7,8,9,10].map(f => (
                            <option key={f} value={f.toString()} className="text-slate-800 bg-white">
                                {lang === 'bn' ? `${['২','৩','৪','৫','৬','৭','৮','৯','১০'][f-2]} তলা` : `${f}th Floor`}
                            </option>
                        ))}
                        <option value="main" className="text-slate-800 bg-white">{t.descoView.mainMeter}</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
                        <Filter size={12} />
                    </div>
                </div>
            </div>
        </div>
        
        {/* Notice Bar */}
        <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-lg px-3 py-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-orange-500 shrink-0" />
            <p className="text-[11px] font-medium text-orange-700 dark:text-orange-400 leading-tight">
                {t.descoView.notice}
            </p>
        </div>
      </div>

      {/* List Container */}
      <div className="px-4 space-y-6 relative z-10">
        {sortedFloors.map((floorKey) => (
          <div key={floorKey}>
            {/* Floor Header */}
            <div className="flex items-center gap-3 mb-3 pl-1">
                <div className="bg-slate-200 dark:bg-slate-700 h-px flex-1"></div>
                <span className="text-xs font-bold text-white bg-red-600 border border-red-500 px-3 py-1 rounded-full shadow-sm uppercase">
                    {getFloorLabel(floorKey)}
                </span>
                <div className="bg-slate-200 dark:bg-slate-700 h-px flex-1"></div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {groupedData[floorKey].map((item, idx) => {
                const isMain = item.flat === 'MAIN';
                return (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 relative overflow-hidden group"
                  >
                     <div className="flex items-center gap-2 sm:gap-4">
                        {/* Flat Avatar */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl flex items-center justify-center text-base sm:text-lg font-black text-white shadow-md ${isMain ? 'bg-slate-700' : 'bg-gradient-to-br from-indigo-500 to-blue-600'}`}>
                            {item.flat}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-bold text-slate-800 dark:text-white truncate text-sm sm:text-base">{item.name}</h3>
                                {isMain && <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 rounded border border-slate-200 dark:border-slate-600 font-bold">POST</span>}
                            </div>
                            
                            <p className="text-[9px] text-slate-400 font-bold mb-0.5 ml-0.5">{t.descoView.account}</p>

                            {/* Copyable Account Chip - Removed truncate, adjusted font size */}
                            <button 
                                onClick={() => handleCopy(item.account)}
                                className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg px-1.5 py-1 transition-colors group/acc w-fit"
                            >
                                <Hash size={10} className="text-slate-400 shrink-0" />
                                <span className="font-mono text-[11px] sm:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-normal">{item.account}</span>
                                <Copy size={10} className="text-slate-300 group-hover/acc:text-indigo-500 shrink-0" />
                            </button>
                        </div>

                        {/* Action - PREMIUM GRADIENT BUTTON */}
                        {!isMain && (
                            <button 
                                onClick={() => setConfirmModalData(item)}
                                className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-lg hover:shadow-indigo-200 text-white px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all active:scale-95 shadow-md group/btn"
                            >
                                <Zap size={14} className="text-yellow-300 fill-yellow-300 group-hover/btn:scale-110 transition-transform" />
                                <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">{t.descoView.recharge}</span>
                            </button>
                        )}
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {sortedFloors.length === 0 && (
            <div className="text-center py-20 opacity-50">
                <Search size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="font-bold text-slate-400 dark:text-slate-500">{t.common.noData}</p>
            </div>
        )}

        {/* Disclaimer Note - Enhanced Graphic Version */}
        <div className="mx-4 mt-8 mb-6">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.15)] border border-red-100 dark:border-red-900/30 overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full blur-2xl opacity-50 pointer-events-none group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-2xl opacity-50 pointer-events-none group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 transition-colors duration-500"></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-3 p-2.5 bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-slate-800 rounded-full ring-1 ring-red-100 dark:ring-red-900/30 shadow-sm">
                         <ShieldCheck className="text-red-500" size={24} />
                    </div>
                    
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-3">
                        {t.descoView.disclaimer}
                    </p>
                    
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-red-200 dark:via-red-900/50 to-transparent mb-3 opacity-50"></div>
                    
                    <p className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {t.descoView.warning}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Confirmation Modal - Centered Style */}
      {confirmModalData && createPortal(
        <div 
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
           <div 
              className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-[340px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
           >
              {/* Header */}
              <div className="px-5 pt-5 pb-3 flex justify-between items-center">
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t.descoView.confirmTitle}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{t.descoView.confirmDesc}</p>
                  </div>
                  <button 
                    onClick={() => setConfirmModalData(null)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
              </div>

              <div className="p-5 pt-0 space-y-4">
                 
                 {/* Account Number Hero Card */}
                 <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
                     {/* Background patterns */}
                     <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                     <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl -ml-6 -mb-6 pointer-events-none"></div>

                     <div className="relative z-10 text-center space-y-1">
                         <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">{t.descoView.account}</p>
                         <div 
                            onClick={() => handleCopy(confirmModalData.account)}
                            className="flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                         >
                             <span className="text-2xl font-mono font-bold tracking-wider">{confirmModalData.account}</span>
                             <Copy size={16} className="text-indigo-300" />
                         </div>
                         <p className="text-[9px] text-indigo-300 pt-0.5">{t.descoView.tapToCopy}</p>
                     </div>
                 </div>

                 {/* Details Grid */}
                 <div className="grid grid-cols-2 gap-3">
                     <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 border border-slate-100 dark:border-slate-600 text-center">
                         <span className="block text-[9px] text-slate-400 dark:text-slate-300 font-bold uppercase mb-0.5">{t.descoView.flat}</span>
                         <span className="block text-xl font-black text-slate-700 dark:text-white">{confirmModalData.flat}</span>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 border border-slate-100 dark:border-slate-600 text-center">
                         <span className="block text-[9px] text-slate-400 dark:text-slate-300 font-bold uppercase mb-0.5">{t.descoView.owner}</span>
                         <span className="block text-base font-bold text-slate-700 dark:text-white truncate">{confirmModalData.name}</span>
                     </div>
                 </div>

                 {/* Instructions */}
                 <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-lg p-2.5 flex gap-2 items-start">
                     <Info size={14} className="text-orange-500 shrink-0 mt-0.5" />
                     <p className="text-[10px] text-orange-800 dark:text-orange-300 font-medium leading-relaxed">
                        {t.descoView.paymentNote}
                     </p>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleProceedToPayment}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span>{t.descoView.payNow}</span>
                        <ExternalLink size={16} />
                    </button>

                    {/* Payment Methods Footer - visual cue */}
                    <div className="flex items-center justify-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                        <span className="text-[9px] font-bold text-slate-400">Supported:</span>
                        <div className="h-4 px-1.5 bg-pink-600 text-white text-[9px] font-bold rounded flex items-center">bKash</div>
                        <div className="h-4 px-1.5 bg-orange-500 text-white text-[9px] font-bold rounded flex items-center">Nagad</div>
                        <div className="h-4 px-1.5 bg-purple-600 text-white text-[9px] font-bold rounded flex items-center">Rocket</div>
                        <div className="h-4 px-1.5 bg-blue-600 text-white text-[9px] font-bold rounded flex items-center">Visa</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>,
        document.body
      )}

      {/* Toast Notification */}
      {showToast && (
        <div 
            className="fixed bottom-24 left-1/2 z-[200] -translate-x-1/2 bg-[#1e1b4b] text-white px-5 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 whitespace-nowrap"
        >
           <Check size={16} className="text-green-400" />
           {t.descoView.copySuccess}
        </div>
      )}

      {/* Quick Recharge Modal Overlay */}
      {showQuickRecharge && (
         <QuickRechargeModal 
           onClose={() => setShowQuickRecharge(false)} 
           data={DESCO_DATA} 
         />
      )}

      {/* Floating Action Widget */}
      {createPortal(
        <>
          <style>{`
            @keyframes redPulse {
              0% { box-shadow:0 0 8px rgba(255,0,0,.6),0 0 16px rgba(255,0,0,.7),0 0 28px rgba(255,0,0,.8); }
              50% { box-shadow:0 0 14px rgba(255,0,0,1),0 0 28px rgba(255,0,0,1),0 0 45px rgba(255,0,0,1); }
              100% { box-shadow:0 0 8px rgba(255,0,0,.6),0 0 16px rgba(255,0,0,.7),0 0 28px rgba(255,0,0,.8); }
            }
            .eb-icon-custom {
              animation: redPulse 3s ease-in-out infinite;
            }
            @keyframes iconPulsePremium {
              0%, 100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
              50% { box-shadow: 0 0 12px rgba(255,255,255,0.4); }
            }
            .icon-premium-pulse {
              animation: iconPulsePremium 3s ease-in-out infinite;
            }
          `}</style>

          {/* Floating Button */}
          <div 
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className="fixed right-[18px] bottom-[90px] w-[40px] h-[40px] rounded-[10px] bg-gradient-to-br from-[#6a11cb] to-[#2575fc] flex items-center justify-center cursor-pointer z-[60] border border-white/35 eb-icon-custom transition-transform active:scale-110"
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className={`w-5 h-5 text-white transition-transform duration-500 ${isPopupOpen ? 'rotate-180' : ''}`}
            >
              <path d="M13 2L3 14h7l-1 8L21 10h-7l-0.999-8z" fill="currentColor"></path>
            </svg>
          </div>

          {/* Popup */}
          {isPopupOpen && (
            <div
              className="fixed right-[18px] bottom-[140px] w-[280px] sm:w-[300px] p-3 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] rounded-[10px] border border-black/5 shadow-2xl z-[60]"
            >
               <h4 className="m-0 mb-1.5 text-base text-white font-extrabold">{t.descoView.popupTitle}</h4>
               
               <div className="bg-white p-2.5 rounded-lg border border-black/5 mb-2.5">
                  <p className="m-0 mb-2 p-0 text-[#333] text-[13px] leading-snug font-semibold">
                    {t.descoView.popupText}
                  </p>
                  <strong className="block text-[#b32222] font-bold text-[13px] mt-1.5 mb-2">{t.descoView.popupNote}</strong>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsDetailsOpen(!isDetailsOpen); }}
                    className="w-full py-2 px-2.5 bg-[#fff7e6] rounded-md border border-black/10 font-bold text-left text-[13px] flex items-center justify-between gap-2 text-slate-800"
                  >
                    <span>{isDetailsOpen ? t.common.hideDetails : t.common.viewDetails}</span>
                    <ChevronRight size={16} className={`transition-transform duration-200 ${isDetailsOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {isDetailsOpen && (
                    <div className="overflow-hidden">
                       <div className="bg-[#fff7e6] mt-1.5 p-2 rounded-md border border-black/5 text-xs font-semibold text-[#111] leading-relaxed">
                          {t.descoView.popupDetails}
                       </div>
                    </div>
                  )}
               </div>

               <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                       setIsPopupOpen(false);
                       setShowQuickRecharge(true);
                    }}
                    className="w-full py-2 px-2.5 rounded-lg bg-gradient-to-r from-[#ff7373] to-[#ff3d3d] text-white font-bold text-[13px] border-none shadow-sm hover:opacity-90 active:scale-95 transition-all"
                  >
                    {t.descoView.rechargeNow}
                  </button>

                  <a 
                    href={BLOG_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-2.5 rounded-lg bg-white text-[#222] font-bold text-[13px] border border-black/5 shadow-sm text-center no-underline hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    {t.descoView.mobileBanking}
                  </a>

                  <button 
                    onClick={() => setIsPopupOpen(false)}
                    className="w-full py-2 px-2.5 rounded-lg bg-white text-[#444] font-bold text-[13px] border border-black/10 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                  >
                     {t.common.cancel}
                  </button>
               </div>
            </div>
          )}
        </>,
        document.body
      )}

    </>
  );
};
