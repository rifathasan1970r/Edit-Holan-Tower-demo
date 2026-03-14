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
  LogIn,
  LogOut as LogOutIcon,
  User as UserIcon
} from 'lucide-react';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

interface Notice {
  id: string;
  title: string;
  date: string;
  driveLink: string;
  createdAt: any;
}

interface EmergencyNoticeDetailViewProps {
  onBack: () => void;
}

const ADMIN_EMAIL = "rifathasan1970r@gmail.com";

export const EmergencyNoticeDetailView: React.FC<EmergencyNoticeDetailViewProps> = ({ onBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setNotices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notice[];
      setNotices(noticesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notices:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
      alert("লগইন করতে সমস্যা হয়েছে।");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdminMode(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !driveLink) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'notices'), {
        title,
        date,
        driveLink,
        createdAt: serverTimestamp()
      });
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
        await deleteDoc(doc(db, 'notices', id));
      } catch (error) {
        console.error("Error deleting notice:", error);
      }
    }
  };

  const isUserAdmin = user?.email === ADMIN_EMAIL;

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
          {user && isUserAdmin && (
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                isAdminMode 
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {isAdminMode ? <Unlock size={20} /> : <Lock size={20} />}
            </button>
          )}
          
          {user && (
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
              title="লগআউট"
            >
              <LogOutIcon size={20} />
            </button>
          )}
        </div>
      </div>

      {!user ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 text-center space-y-6">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto">
            <UserIcon size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">লগইন করুন</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              জরুরী নোটিশসমূহ দেখতে আপনার গুগল একাউন্ট দিয়ে লগইন করুন।
            </p>
          </div>
          <button 
            onClick={handleLogin}
            disabled={authLoading}
            className="w-full py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax/google.png" alt="Google" className="w-6 h-6" />
            গুগল দিয়ে লগইন করুন
          </button>
        </div>
      ) : (
        <>
          {/* Admin Controls */}
          <AnimatePresence>
            {isAdminMode && isUserAdmin && (
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                        <FileText size={24} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-white truncate mb-1">
                          {notice.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {notice.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => window.open(notice.driveLink, '_blank')}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-all"
                          title="ভিউ পিডিএফ"
                        >
                          <ExternalLink size={18} />
                        </button>
                        
                        {isAdminMode && isUserAdmin && (
                          <button 
                            onClick={() => handleDeleteNotice(notice.id)}
                            className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
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
        </>
      )}

      {/* Footer Info */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
          হলান টাওয়ার ম্যানেজমেন্ট সিস্টেম
        </p>
      </div>
    </div>
  );
};
