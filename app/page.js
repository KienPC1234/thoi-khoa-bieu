'use client';
import { useState, useEffect } from 'react';
import { getStorage, saveStorage } from '../utils/storage';
import { generatePDF } from '../utils/pdfGenerator';
import ScheduleModal from '../components/ScheduleModal';
import ConfigModal from '../components/ConfigModal';
import ThemeToggle from '../components/ThemeToggle';
import { Calendar, Download, Settings, Plus, ChevronDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

export default function Home() {
  // --- STATE ---
  const [storage, setStorage] = useState({ activeId: 'default', tables: {} });
  const [mounted, setMounted] = useState(false);
  
  // Modals & Menu
  const [modalOpen, setModalOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // --- INIT ---
  useEffect(() => {
    setStorage(getStorage());
    setMounted(true);
  }, []);

  // --- DATA HELPERS ---
  const currentTableId = storage.activeId;
  const currentTable = storage.tables[currentTableId] || {};
  const scheduleData = currentTable.data || {};
  const config = currentTable.config || { maxPeriods: 10, breaks: [] };

  // --- ACTIONS (Logic cũ giữ nguyên) ---

  const switchTable = (id) => {
    const newStorage = { ...storage, activeId: id };
    setStorage(newStorage);
    saveStorage(newStorage);
    setMenuOpen(false);
  };

  const addNewTable = () => {
    const id = 'table_' + Date.now();
    const newTable = {
      id,
      name: 'TKB Mới ' + new Date().toLocaleDateString('vi-VN'),
      year: '2024 - 2025',
      data: {},
      config: { maxPeriods: 10, breaks: [{ after: 5, label: 'NGHỈ TRƯA' }] }
    };
    const newStorage = { ...storage, activeId: id, tables: { ...storage.tables, [id]: newTable } };
    setStorage(newStorage);
    saveStorage(newStorage);
    setMenuOpen(false);
  };

  const deleteCurrentTable = () => {
    if (Object.keys(storage.tables).length <= 1) return alert("Không thể xóa bảng cuối cùng!");
    if (!confirm(`Xóa bảng "${currentTable.name}"?`)) return;
    const newTables = { ...storage.tables };
    delete newTables[currentTableId];
    const nextId = Object.keys(newTables)[0];
    const newStorage = { activeId: nextId, tables: newTables };
    setStorage(newStorage);
    saveStorage(newStorage);
    setMenuOpen(false);
  }

  const handleUpdateConfig = (name, year, newConfig) => {
    const updatedTable = { ...currentTable, name, year, config: newConfig };
    const newStorage = { ...storage, tables: { ...storage.tables, [currentTableId]: updatedTable } };
    setStorage(newStorage);
    saveStorage(newStorage);
  };

  const handleSaveSlot = (newData) => {
    if (!selectedSlot) return;
    const key = `${selectedSlot.dayIndex}-${selectedSlot.period}`;
    const updatedData = { ...scheduleData, [key]: newData };
    const updatedTable = { ...currentTable, data: updatedData };
    const newStorage = { ...storage, tables: { ...storage.tables, [currentTableId]: updatedTable } };
    setStorage(newStorage);
    saveStorage(newStorage);
  };

  const handleDeleteSlot = () => {
    if (!selectedSlot) return;
    const key = `${selectedSlot.dayIndex}-${selectedSlot.period}`;
    const updatedData = { ...scheduleData };
    delete updatedData[key];
    const updatedTable = { ...currentTable, data: updatedData };
    const newStorage = { ...storage, tables: { ...storage.tables, [currentTableId]: updatedTable } };
    setStorage(newStorage);
    saveStorage(newStorage);
  };

  // --- XUẤT PDF ---
  const exportPDF = () => {
    generatePDF(currentTable, currentTable, DAYS);
  };

  if (!mounted) return null;

  // --- RENDER GIAO DIỆN (UI) ---
  const uiRows = [];
  const periods = Array.from({ length: config.maxPeriods }, (_, i) => i + 1);
  periods.forEach(period => {
    uiRows.push({ type: 'period', value: period });
    const breakRow = config.breaks?.find(b => b.after === period);
    if (breakRow) uiRows.push({ type: 'break', label: breakRow.label });
  });

  return (
    <main className="min-h-screen p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER AREA */}
        <div className="relative z-30 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white/40 dark:border-white/5">
          <div>
            <div className="relative inline-block text-left z-50">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 hover:opacity-80 transition drop-shadow-sm"
              >
                {currentTable.name}
                <ChevronDown className="text-indigo-500 mt-2" size={32} />
              </button>
              
              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50"
                  >
                    <div className="p-2 space-y-1">
                      {Object.values(storage.tables).map(tbl => (
                        <button
                          key={tbl.id}
                          onClick={() => switchTable(tbl.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex justify-between items-center
                            ${storage.activeId === tbl.id 
                              ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50'}`}
                        >
                          {tbl.name}
                          {storage.activeId === tbl.id && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                        </button>
                      ))}
                      <div className="h-px bg-gray-200 dark:bg-slate-700/50 my-2 mx-2"></div>
                      <button onClick={addNewTable} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition">
                        <Plus size={18} /> Tạo bảng mới
                      </button>
                      <button onClick={deleteCurrentTable} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition">
                        <Trash2 size={18} /> Xóa bảng này
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-3 mt-4">
               <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-2">
                 <Calendar size={16} className="text-indigo-500" /> Năm học: {currentTable.year}
               </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
             <ThemeToggle />
             <div className="h-8 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden md:block"></div>
             <button onClick={() => setConfigOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md transition">
               <Settings size={20} /> <span className="hidden sm:inline">Cấu hình</span>
             </button>
             <button onClick={exportPDF} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition">
               <Download size={20} /> <span className="hidden sm:inline">Xuất PDF</span>
             </button>
          </div>
        </div>

        {/* --- UI TABLE --- */}
        <div className="relative z-10 bg-white dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-2 border border-white/50 dark:border-slate-700/50">
           
           <div className="overflow-x-auto rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="min-w-[1000px]">
              
              <div className="grid grid-cols-8 bg-slate-100 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <div className="p-5 flex items-center justify-center font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs">Tiết</div>
                {DAYS.map((day, i) => (
                  <div key={i} className="p-5 font-black text-center uppercase text-sm text-slate-600 dark:text-slate-300 tracking-wide">{day}</div>
                ))}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900/20">
                {uiRows.map((row, index) => {
                  if (row.type === 'break') {
                    return (
                      <div key={`break-${index}`} className="grid grid-cols-1">
                        <div className="py-3 bg-orange-50 dark:bg-orange-900/10 text-orange-500 dark:text-orange-400 font-bold text-center text-xs tracking-[0.2em] uppercase border-y border-orange-100 dark:border-orange-900/20 backdrop-blur-sm">
                          {row.label}
                        </div>
                      </div>
                    );
                  }

                  const period = row.value;
                  return (
                    <div key={`period-${period}`} className="grid grid-cols-8 group hover:bg-indigo-50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="p-4 font-bold text-slate-400 dark:text-slate-600 flex items-center justify-center border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 group-hover:bg-indigo-100/50 dark:group-hover:bg-slate-800/40 transition-colors">
                        {period}
                      </div>

                      {DAYS.map((_, dayIndex) => {
                        const key = `${dayIndex}-${period}`;
                        const cellData = scheduleData[key];
                        return (
                          <div
                            key={key}
                            onClick={() => { setSelectedSlot({ dayIndex, period }); setModalOpen(true); }}
                            className={`
                              relative min-h-[100px] p-3 border-l border-slate-100 dark:border-slate-800/50 cursor-pointer 
                              flex flex-col justify-center items-center text-center gap-1.5 transition-all duration-200
                              ${cellData 
                                ? 'bg-indigo-100/60 dark:bg-indigo-500/10 hover:bg-indigo-200/60 dark:hover:bg-indigo-500/20' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 active:scale-[0.98]'}
                            `}
                          >
                            {cellData ? (
                              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full">
                                <span className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug drop-shadow-sm">
                                  {cellData.subject}
                                </span>
                                {cellData.location && (
                                  <span className="inline-block mt-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-300 bg-white/80 dark:bg-indigo-900/40 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-700/30 shadow-sm backdrop-blur-sm">
                                    {cellData.location}
                                  </span>
                                )}
                              </motion.div>
                            ) : (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                                    <Plus size={16} strokeWidth={3} />
                                  </div>
                                </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSlot}
        onDelete={handleDeleteSlot}
        initData={selectedSlot ? scheduleData[`${selectedSlot.dayIndex}-${selectedSlot.period}`] : null}
        title={selectedSlot ? `${DAYS[selectedSlot.dayIndex]} - Tiết ${selectedSlot.period}` : ''}
      />
      <ConfigModal 
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
        onSave={handleUpdateConfig}
        currentTable={currentTable}
      />
    </main>
  );
}