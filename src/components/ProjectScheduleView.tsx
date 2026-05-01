/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { WeeklySchedule, ProjectMemo } from '../types';
import { Calendar as CalendarIcon, Plus, Trash2, Save, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  weeklyLogs: WeeklySchedule[];
  memos: ProjectMemo[];
  onSaveWeekly: (log: WeeklySchedule) => void;
  onDeleteWeekly: (id: string) => void;
  onSaveMemo: (memo: ProjectMemo) => void;
  onDeleteMemo: (id: string) => void;
}

export default function ProjectScheduleView({ 
  weeklyLogs, 
  memos, 
  onSaveWeekly, 
  onDeleteWeekly, 
  onSaveMemo, 
  onDeleteMemo 
}: Props) {
  const [viewMode, setViewMode] = useState<'WEEKLY' | 'MONTHLY' | 'CALENDAR'>('WEEKLY');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Weekly Form State
  const [formData, setFormData] = useState<Partial<WeeklySchedule>>({
    weekRange: '',
    content: '',
    items: [{ trade: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }]
  });

  // Calendar Memo State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');
  const [memoCategory, setMemoCategory] = useState<'IMPORTANT' | 'NORMAL' | 'ISSUE'>('NORMAL');

  // Helper: Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // Weekly Form Handlers
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...(formData.items || []), { trade: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: (formData.items || []).filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSaveWeekly = () => {
    if (!formData.weekRange) return;
    onSaveWeekly({
      id: Math.random().toString(36).substr(2, 9),
      siteId: '',
      weekRange: formData.weekRange || '',
      content: formData.content || '',
      items: formData.items || []
    } as WeeklySchedule);
    setFormData({
      weekRange: '',
      content: '',
      items: [{ trade: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }]
    });
  };

  const handleSaveMemo = () => {
    if (!selectedDate || !memoText) return;
    onSaveMemo({
      id: Math.random().toString(36).substr(2, 9),
      siteId: '',
      date: selectedDate,
      content: memoText,
      category: memoCategory
    });
    setMemoText('');
    setSelectedDate(null);
  };

  const calendarDays = [];
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Fill empty slots before 1st
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">일반 공정표 & 통합 스케줄</h2>
          <p className="text-xs text-gray-500 mt-1">월간/주간 공정 계획과 현장 메모를 통합 관리합니다.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
          <button 
            onClick={() => setViewMode('MONTHLY')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${viewMode === 'MONTHLY' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
          >
            <LayoutGrid size={14} /> 월간
          </button>
          <button 
            onClick={() => setViewMode('WEEKLY')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${viewMode === 'WEEKLY' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
          >
            <List size={14} /> 주간
          </button>
          <button 
            onClick={() => setViewMode('CALENDAR')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${viewMode === 'CALENDAR' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400'}`}
          >
            <CalendarIcon size={14} /> 메모
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {viewMode === 'MONTHLY' && (
          <motion.div 
            key="monthly"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="card p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900">
                  {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 공정 통합뷰
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><ChevronLeft size={20} /></button>
                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {['일','월','화','수','목','금','토'].map((d, i) => (
                  <div key={d} className={`bg-gray-50 p-2 text-center text-[10px] font-black ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}`}>
                    {d}
                  </div>
                ))}
                {calendarDays.map((day, idx) => {
                  const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}` : '';
                  const dayMemos = memos.filter(m => m.date === dateStr);
                  
                  return (
                    <div 
                      key={idx} 
                      className={`bg-white min-h-[80px] md:min-h-[120px] p-2 hover:bg-blue-50/30 transition-colors cursor-pointer group ${!day ? 'bg-gray-50/50' : ''}`}
                      onClick={() => day && setSelectedDate(dateStr)}
                    >
                      {day && (
                        <>
                          <span className={`text-[11px] font-bold ${idx % 7 === 0 ? 'text-red-500' : idx % 7 === 6 ? 'text-blue-500' : 'text-gray-900'}`}>
                            {day}
                          </span>
                          <div className="mt-1 space-y-1">
                            {dayMemos.map(m => (
                              <div key={m.id} className={`text-[9px] px-1 py-0.5 rounded truncate font-black ${
                                m.category === 'IMPORTANT' ? 'bg-red-50 text-red-600' : 
                                m.category === 'ISSUE' ? 'bg-orange-50 text-orange-600' : 
                                'bg-blue-50 text-brand-blue'
                              }`}>
                                {m.content}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'WEEKLY' && (
          <motion.div 
            key="weekly"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="card p-4 md:p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 pb-4">
                <h3 className="text-lg font-black text-gray-900">주간 공정 계획 수립</h3>
                <button 
                  onClick={handleSaveWeekly}
                  disabled={!formData.weekRange}
                  className="btn-primary w-full md:w-auto px-6 py-3 md:py-2 text-xs font-black shadow-lg shadow-brand-blue/20"
                >
                  <Save size={14} className="mr-2" /> 계획 저장하기
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">주간 범위 [Period]</label>
                  <input 
                    type="text"
                    placeholder="2024.05.01 ~ 05.07"
                    value={formData.weekRange}
                    onChange={e => setFormData({...formData, weekRange: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">주요 일정 요약 [Summary]</label>
                  <input 
                    type="text"
                    placeholder="예: 기초 콘크리트 타설 및 양생"
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 w-40">공종명</th>
                      {['월','화','수','목','금','토','일'].map((d, i) => (
                        <th key={d} className={`p-3 text-[10px] font-black uppercase tracking-widest border-b border-gray-100 border-l border-gray-100 text-center ${i === 5 ? 'text-blue-500 bg-blue-50/30' : i === 6 ? 'text-red-500 bg-red-50/30' : 'text-gray-400'}`}>
                          {d}
                        </th>
                      ))}
                      <th className="p-3 border-b border-gray-100 border-l border-gray-100"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {formData.items?.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="p-2">
                          <input 
                            type="text" 
                            value={item.trade} 
                            onChange={e => updateItem(idx, 'trade', e.target.value)}
                            placeholder="공종 입력..."
                            className="w-full bg-transparent border-none p-2 text-sm font-black focus:ring-0"
                          />
                        </td>
                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                          <td key={day} className="p-1 border-l border-gray-50">
                            <input 
                              type="text" 
                              value={(item as any)[day]} 
                              onChange={e => updateItem(idx, day, e.target.value)}
                              className="w-full bg-transparent border-none p-1 text-[11px] font-bold text-center focus:ring-0"
                            />
                          </td>
                        ))}
                        <td className="p-2 border-l border-gray-50 text-center">
                          <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  onClick={addItem}
                  className="w-full py-4 bg-gray-50 text-gray-500 hover:bg-gray-100 text-xs font-black flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={16} /> 행 추가하기
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">기존 주간 공정표 관리</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weeklyLogs.map(log => (
                  <div key={log.id} className="card p-5 group hover:border-brand-blue transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-black text-gray-900">{log.weekRange}</h4>
                        <p className="text-xs text-gray-500 mt-1">{log.content}</p>
                      </div>
                      <button 
                        onClick={() => onDeleteWeekly(log.id)}
                        className="text-gray-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                      <span className="text-[10px] font-black text-brand-blue bg-blue-50 px-3 py-1 rounded-full uppercase">
                        {log.items.length}개 공종
                      </span>
                      <button className="text-[10px] font-black text-gray-400 hover:text-brand-blue hover:underline ml-auto">상세보기</button>
                    </div>
                  </div>
                ))}
                {weeklyLogs.length === 0 && (
                  <div className="col-span-full py-16 text-center border-4 border-dashed border-gray-50 text-gray-300 rounded-2xl flex flex-col items-center gap-2">
                    <List size={40} className="opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest italic">저장된 공정표가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'CALENDAR' && (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">전체 현장 메모</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {memos.map(memo => (
                    <div key={memo.id} className="card p-5 group flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                          memo.category === 'IMPORTANT' ? 'bg-red-50 text-red-600' : 
                          memo.category === 'ISSUE' ? 'bg-orange-50 text-orange-600' : 
                          'bg-blue-50 text-brand-blue'
                        }`}>
                          {memo.category}
                        </span>
                        <button onClick={() => onDeleteMemo(memo.id)} className="text-gray-300 hover:text-red-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gray-800 leading-relaxed mb-4 flex-1">
                        {memo.content}
                      </p>
                      <div className="text-[10px] font-black text-gray-400 font-mono mt-auto pt-4 border-t border-gray-50">
                        DATE: {memo.date}
                      </div>
                    </div>
                  ))}
                  {memos.length === 0 && (
                    <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-50 text-gray-300 rounded-2xl flex flex-col items-center gap-2">
                      <CalendarIcon size={40} className="opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest italic">등록된 메모가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">신규 메모 작성</h3>
                <div className="card p-6 sticky top-20 bg-white shadow-xl shadow-brand-blue/5 border-none">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">날짜 선택</label>
                      <input 
                        type="date"
                        value={selectedDate || ''}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-black focus:ring-2 focus:ring-brand-blue/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">중요도</label>
                      <div className="flex gap-2">
                        {(['IMPORTANT', 'NORMAL', 'ISSUE'] as const).map(cat => (
                          <button
                            key={cat}
                            onClick={() => setMemoCategory(cat)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black tracking-tighter uppercase border transition-all ${
                              memoCategory === cat ? 
                              'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20' : 
                              'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                            }`}
                          >
                            {cat === 'IMPORTANT' ? '중요' : cat === 'ISSUE' ? '이슈' : '일반'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">메모 내용</label>
                      <textarea 
                        value={memoText}
                        onChange={e => setMemoText(e.target.value)}
                        placeholder="현장의 중요한 전달사항이나 특이사항을 기록하세요..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none min-h-[140px]"
                      />
                    </div>
                    <button 
                      onClick={handleSaveMemo}
                      disabled={!selectedDate || !memoText}
                      className="w-full py-4 bg-brand-blue text-white rounded-xl text-xs font-black shadow-xl shadow-brand-blue/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      기록 저장하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date Detail Modal */}
      <AnimatePresence>
        {selectedDate && viewMode === 'MONTHLY' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border-4 border-brand-blue p-8 w-full max-w-lg shadow-[16px_16px_0px_#141414]"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-blue text-white p-3 rounded-xl shadow-lg shadow-brand-blue/20">
                    <CalendarIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">{selectedDate}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Schedule Details</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">기록된 메모</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {memos.filter(m => m.date === selectedDate).map(m => (
                      <div key={m.id} className="bg-gray-50 p-4 rounded-xl relative group">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter mb-2 inline-block ${
                          m.category === 'IMPORTANT' ? 'bg-red-50 text-red-600' : 
                          m.category === 'ISSUE' ? 'bg-orange-50 text-orange-600' : 
                          'bg-blue-50 text-brand-blue'
                        }`}>
                          {m.category}
                        </span>
                        <p className="text-sm font-bold text-gray-800">{m.content}</p>
                        <button 
                          onClick={() => onDeleteMemo(m.id)}
                          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {memos.filter(m => m.date === selectedDate).length === 0 && (
                      <p className="text-center py-10 text-xs text-gray-300 italic font-bold">등록된 상세 메모가 없습니다.</p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setViewMode('CALENDAR');
                      // setSelectedDate(selectedDate); // Already set
                    }}
                    className="w-full py-4 bg-brand-blue text-white rounded-xl text-xs font-black shadow-xl shadow-brand-blue/20 active:scale-95 transition-all"
                  >
                    메모 추가하러 가기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
