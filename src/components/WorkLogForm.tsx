/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { WorkLog } from '../types';
import { Send, CloudSun, Calendar } from 'lucide-react';

interface Props {
  logs: WorkLog[];
  onSave: (log: WorkLog) => void;
}

export default function WorkLogForm({ logs, onSave }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const existingLog = logs.find(l => l.date === today);
  
  const [formData, setFormData] = useState<Partial<WorkLog>>(existingLog || {
    date: today,
    weather: '맑음',
    todayWork: '',
    tomorrowWork: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      id: formData.id || `work-${Date.now()}`,
      siteId: '', // Handled by parent
      date: formData.date || today,
      weather: formData.weather || '맑음',
      todayWork: formData.todayWork || '',
      tomorrowWork: formData.tomorrowWork || ''
    } as WorkLog);
    alert('저장되었습니다.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">공사일보 작성</h2>
          <p className="text-xs text-gray-500 mt-1">현장의 작업 내용을 기록하고 보고서를 생성합니다.</p>
        </div>
        <div className="text-right text-[11px] text-gray-400 font-medium">
          기준일자: {today}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="card p-4 md:p-8 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-700 flex items-center gap-2">
              <Calendar size={14} className="text-brand-blue" /> 날짜
            </label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full bg-gray-50 border border-border-gray rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-700 flex items-center gap-2">
              <CloudSun size={14} className="text-brand-blue" /> 날씨
            </label>
            <select 
              value={formData.weather}
              onChange={e => setFormData({...formData, weather: e.target.value})}
              className="w-full bg-gray-50 border border-border-gray rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium h-[46px] md:h-auto"
            >
              <option>맑음</option>
              <option>흐림</option>
              <option>비</option>
              <option>눈</option>
              <option>강풍</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-700 block">금일 작업 내용</label>
          <textarea 
            rows={window.innerWidth < 768 ? 8 : 6}
            value={formData.todayWork}
            onChange={e => setFormData({...formData, todayWork: e.target.value})}
            placeholder="오늘 진행된 주요 공정 및 특이사항을 입력하세요."
            className="w-full bg-gray-50 border border-border-gray rounded-lg px-4 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-gray-300 leading-relaxed"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-700 block">명일 작업 계획</label>
          <textarea 
            rows={window.innerWidth < 768 ? 5 : 4}
            value={formData.tomorrowWork}
            onChange={e => setFormData({...formData, tomorrowWork: e.target.value})}
            placeholder="내일 예정된 주요 공정 및 준비사항을 입력하세요."
            className="w-full bg-gray-50 border border-border-gray rounded-lg px-4 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-gray-300 leading-relaxed"
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            className="btn-primary w-full md:w-auto px-10 py-4 md:py-3 flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 text-base md:text-sm"
          >
            <Send size={18} className="md:size-4" />
            저장 및 제출하기
          </button>
        </div>
      </form>

      {/* History section */}
      <div className="pt-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">최근 작성 내역</h3>
        <div className="space-y-2">
          {logs.slice(-3).reverse().map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 card hover:border-brand-blue/30 transition-colors group">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-900">{log.date}</span>
                <span className="text-xs text-gray-500 line-clamp-1 italic">{log.todayWork.substring(0, 50)}...</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge">{log.weather}</span>
                <button 
                  onClick={() => setFormData(log)}
                  className="text-xs text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity font-semibold"
                >
                  불러오기
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setFormData({ date: today, weather: '맑음', todayWork: '', tomorrowWork: '' })}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            신규 작성으로 리셋
          </button>
        </div>
      </div>
    </div>
  );
}

