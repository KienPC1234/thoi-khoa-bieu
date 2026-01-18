'use client';
import { X, Save, Plus, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ConfigModal({ isOpen, onClose, onSave, currentTable }) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [maxPeriods, setMaxPeriods] = useState(10);
  const [breakLabel, setBreakLabel] = useState('NGHỈ TRƯA');
  const [breakAfter, setBreakAfter] = useState(5);

  useEffect(() => {
    if (currentTable) {
      setName(currentTable.name);
      setYear(currentTable.year);
      setMaxPeriods(currentTable.config?.maxPeriods || 10);
      // Lấy cấu hình nghỉ trưa đầu tiên (demo đơn giản)
      const firstBreak = currentTable.config?.breaks?.[0];
      setBreakLabel(firstBreak?.label || 'NGHỈ TRƯA');
      setBreakAfter(firstBreak?.after || 0);
    }
  }, [currentTable, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newConfig = {
      maxPeriods: parseInt(maxPeriods),
      breaks: parseInt(breakAfter) > 0 ? [{ after: parseInt(breakAfter), label: breakLabel }] : []
    };
    onSave(name, year, newConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 animate-in zoom-in duration-200 border border-transparent dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Cấu hình Bảng</h3>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên bảng (VD: Học kỳ 2)</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Năm học</label>
            <input 
              value={year} 
              onChange={e => setYear(e.target.value)} 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors" 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tổng số tiết</label>
              <input 
                type="number" 
                min="1" 
                max="15" 
                value={maxPeriods} 
                onChange={e => setMaxPeriods(e.target.value)} 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors" 
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Dòng ngăn cách (Gộp hàng)</h4>
            <div className="grid grid-cols-3 gap-2">
               <div className="col-span-2">
                  <input 
                    placeholder="Nội dung (VD: Nghỉ trưa)" 
                    value={breakLabel} 
                    onChange={e => setSetBreakLabel(e.target.value)} 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors" 
                  />
               </div>
               <div>
                  <input 
                    type="number" 
                    placeholder="Sau tiết?" 
                    value={breakAfter} 
                    onChange={e => setBreakAfter(e.target.value)} 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition-colors" 
                  />
               </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nhập "Sau tiết" = 0 để tắt dòng nghỉ.</p>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl mt-4 transition">
            Lưu Cấu Hình
          </button>
        </form>
      </div>
    </div>
  );
}