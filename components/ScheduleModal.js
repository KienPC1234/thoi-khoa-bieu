'use client';
import { X, Save, Trash2, BookOpen, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScheduleModal({ isOpen, onClose, onSave, onDelete, initData, title }) {
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubject(initData?.subject || '');
      setLocation(initData?.location || '');
    }
  }, [isOpen, initData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ subject, location });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Bạn muốn xóa lịch học này?')) {
      onDelete();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop (Nền đen mờ) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />

                      {/* Modal Content */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="relative w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-slate-700/50"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">Chỉnh sửa lịch học</h3>
                          <p className="text-violet-100 text-sm opacity-90 mt-1">{title}</p>
                        </div>
                        <button 
                          onClick={onClose} 
                          className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition text-white"
                        >
                          <X size={20} />
                        </button>
                      </div>
          
                      {/* Body */}
                      <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 gap-2">
                            <BookOpen size={16} className="text-violet-500 dark:text-violet-400"/> Môn học
                          </label>
                          <input
                            autoFocus
                            type="text"
                            required
                            placeholder="Nhập tên môn..."
                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 gap-2">
                            <MapPin size={16} className="text-violet-500 dark:text-violet-400"/> Địa điểm / Ghi chú
                          </label>
                          <input
                            type="text"
                            placeholder="P.101, Nhà A..."
                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all shadow-sm"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          />
                        </div>
          
                        {/* Footer Actions */}
                        <div className="flex gap-3 mt-8 pt-2">
                          {initData && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={handleDelete}
                              className="p-3 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition flex items-center justify-center"
                            >
                              <Trash2 size={20} />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition flex items-center justify-center gap-2"
                          >
                            <Save size={18} /> Lưu thay đổi
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>        </div>
      )}
    </AnimatePresence>
  );
}