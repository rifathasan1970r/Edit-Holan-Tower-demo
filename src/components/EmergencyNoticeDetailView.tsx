import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Plus, 
  Calendar as CalendarIcon, 
  FileText, 
  ExternalLink,
  Trash2,
  X,
  Send,
  LogOut as LogOutIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  date: string;
  driveLink: string;
  createdAt: number;
}

interface EmergencyNoticeDetailViewProps {
  onBack: () => void;
}

export const EmergencyNoticeDetailView: React.FC<EmergencyNoticeDetailViewProps> = ({ onBack }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'emergency_notices')
        .single();
        
      if (data && data.value) {
        const parsedNotices = JSON.parse(data.value);
        // Sort by createdAt descending
        parsedNotices.sort((a: Notice, b: Notice) => b.createdAt - a.createdAt);
        setNotices(parsedNotices);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleLockClick = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = () => {
    if (pinInput === '1966') { 
      setIsAdminMode(true);
      setShowLogin(false);
      setPinInput('');
    } else {
      alert('ভুল পিন কোড!');
    }
  };

  const handleLogout = () => {
    setIsAdminMode(false);
  };

  const getPreviewLink = (url: string) => {
    if (url.includes('drive.google.com')) {
      return url.replace(/\/(view|edit).*$/, '/preview');
    }
    return url;
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !driveLink) return;

    setIsSubmitting(true);
    try {
      const newNotice: Notice = {
        id: Date.now().toString(),
        title,
        date,
        driveLink,
        createdAt: Date.now()
      };
      
      const newNotices = [newNotice, ...notices];
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({ key: 'emergency_notices', value: JSON.stringify(newNotices) }, { onConflict: 'key' });
        
      if (error) throw error;
      
      setNotices(newNotices);
      setTitle('');
      setDate('');
      setDriveLink('');
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding notice:", error);
      alert("নোটিশ যোগ করতে সমস্যা হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই নোটিশটি ডিলিট করতে চান?')) {
      try {
        const newNotices = notices.filter(n => n.id !== id);
        const { error } = await supabase
          .from('app_settings')
          .upsert({ key: 'emergency_notices', value: JSON.stringify(newNotices) }, { onConflict: 'key' });
          
        if (error) throw error;
        setNotices(newNotices);
      } catch (error) {
        console.error("Error deleting notice:", error);
      }
    }
  };

  if (previewNotice) {
    return (
      <div className="space-y-4 pb-20 min-h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPreviewNotice(null)} 
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
            </button>
            <div className="flex flex-col">
              <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1 text-sm sm:text-base">
                {previewNotice.title}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {previewNotice.date}
              </span>
            </div>
          </div>
          <button 
            onClick={() => window.open(previewNotice.driveLink, '_blank')}
            className="p-2.5 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 hover:bg-primary-100 transition-all shrink-0"
            title="ব্রাউজারে ওপেন করুন"
          >
            <ExternalLink size={20} />
          </button>
        </div>

        {/* PDF Preview Container */}
        <div className="flex-1 w-full flex flex-col items-center justify-start">
          <div 
            className="w-full bg-white shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl" 
            style={{ aspectRatio: '1 / 1.414', maxHeight: '75vh' }}
          >
            <iframe 
              src={getPreviewLink(previewNotice.driveLink)} 
              className="w-full h-full border-none bg-white"
              title="PDF Preview"
              allow="autoplay"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">জরুরী নোটিশ</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {isAdminMode && (
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
              title="লগআউট"
            >
              <LogOutIcon size={20} />
            </button>
          )}
          <button 
            onClick={handleLockClick}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isAdminMode 
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {isAdminMode ? <Unlock size={20} /> : <Lock size={20} />}
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">এডমিন লগইন</h3>
                <button onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-rose-500">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 block">পিন কোড দিন</label>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="****"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLogin();
                    }}
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 active:scale-95 transition-all"
                >
                  লগইন করুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Controls */}
      <AnimatePresence>
        {isAdminMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-xl border border-primary-100 dark:border-primary-900/30"
          >
            {!showAddForm ? (
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/20"
              >
                <Plus size={20} />
                নতুন নোটিশ যোগ করুন
              </button>
            ) : (
              <form onSubmit={handleAddNotice} className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-white">নতুন নোটিশ ফরম</h3>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-rose-500">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">নোটিশের নাম</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="উদা: পানির বিল সংক্রান্ত নোটিশ"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">তারিখ</label>
                    <input 
                      type="text" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="উদা: ১৪ মার্চ ২০২৬"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">ড্রাইভ লিংক (PDF)</label>
                    <input 
                      type="url" 
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'পাবলিশ হচ্ছে...' : (
                    <>
                      <Send size={18} />
                      পাবলিশ করুন
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notices List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <AlertTriangle size={18} className="text-amber-500" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200">সাম্প্রতিক নোটিশসমূহ</h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">লোড হচ্ছে...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl text-center border border-dashed border-slate-200 dark:border-slate-700">
            <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">কোনো নোটিশ পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setPreviewNotice(notice)}
                className="group relative bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Subtle background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                    <FileText size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-white text-base leading-snug mb-2 line-clamp-2 pr-2">
                      {notice.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg">
                        <CalendarIcon size={14} className="text-primary-500" />
                        {notice.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0 z-10">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <ExternalLink size={18} />
                    </div>
                    
                    {isAdminMode && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotice(notice.id);
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm"
                        title="ডিলিট"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
          হলান টাওয়ার ম্যানেজমেন্ট সিস্টেম
        </p>
      </div>
    </div>
  );
};

