/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PersonnelLog } from '../types';
import { Plus, Trash2, Users } from 'lucide-react';

interface Props {
  logs: PersonnelLog[];
  partners: string[];
  onSave: (log: PersonnelLog) => void;
  onDelete: (id: string) => void;
}

export default function PersonnelForm({ logs, partners, onSave, onDelete }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [partner, setPartner] = useState(partners[0] || '');
  const [trade, setTrade] = useState('');
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    if (!partner || !trade || count <= 0) return;
    onSave({
      id: `per-${Date.now()}`,
      siteId: '', // Handled by parent
      date: today,
      partnerName: partner,
      trade,
      count
    });
    setTrade('');
    setCount(0);
  };

  const todayLogs = logs.filter(l => l.date === today);

  const getTopPartner = () => {
    const partnerTotals: Record<string, number> = {};
    logs.forEach(l => {
      partnerTotals[l.partnerName] = (partnerTotals[l.partnerName] || 0) + l.count;
    });
    
    let topPartner = '데이터 없음';
    let maxCount = 0;
    
    Object.entries(partnerTotals).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topPartner = name;
      }
    });
    
    return { name: topPartner, count: maxCount };
  };

  const topPartner = getTopPartner();

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">인원 투입 관리</h2>
          <p className="text-xs text-gray-500 mt-1">일자별 현장 투입 인원을 기록하고 통계를 확인합니다.</p>
        </div>
        <div className="flex items-baseline gap-2 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm md:shadow-none md:border-0 md:bg-transparent">
          <span className="text-xs text-gray-400 font-medium">금일 {today}:</span>
          <span className="text-2xl font-extrabold text-brand-blue">
            {todayLogs.reduce((acc, curr) => acc + curr.count, 0)}
          </span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">PERSONS</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-1">
          <div className="card p-4 md:p-6 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">신규 데이터 입력</h3>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 block">업체명 (수기 입력)</label>
              <input 
                type="text"
                placeholder="예: 대륙건설"
                value={partner}
                onChange={e => setPartner(e.target.value)}
                className="w-full bg-gray-50 border border-border-gray rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 block">공종 (직종)</label>
              <input 
                type="text"
                placeholder="예: 목수, 철근, 일반공"
                value={trade}
                onChange={e => setTrade(e.target.value)}
                className="w-full bg-gray-50 border border-border-gray rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 block">인원 (명)</label>
              <input 
                type="number"
                inputMode="numeric"
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full bg-gray-50 border border-border-gray rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-bold"
              />
            </div>

            <button 
              onClick={handleAdd}
              disabled={!trade || count <= 0}
              className="w-full py-4 md:py-2.5 bg-brand-blue text-white rounded-lg text-sm md:text-xs font-bold uppercase tracking-wider hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-4 shadow-md shadow-brand-blue/10"
            >
              <Plus size={20} className="md:size-4" /> 인원 추가하기
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="card p-0 overflow-hidden md:border md:border-border-gray md:rounded-xl">
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_60px] bg-sidebar-dark text-white text-[11px] font-bold p-3 uppercase tracking-wider">
              <div className="px-2">업체명 / 공종</div>
              <div className="px-2 text-center">투입 인원</div>
              <div className="px-2 text-center">관리</div>
            </div>
            <div className="bg-white divide-y divide-gray-100">
              {todayLogs.map((log, i) => (
                <div key={log.id} className="flex md:grid md:grid-cols-[1.5fr_1fr_60px] items-center justify-between p-4 md:p-3 text-sm hover:bg-blue-50/30 transition-colors">
                  <div className="px-0 md:px-2 flex flex-col md:flex-row md:items-center">
                    <span className="font-bold text-gray-900 text-base md:text-sm">{log.partnerName}</span>
                    <span className="text-[10px] w-fit bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded mt-1 md:mt-0 md:ml-2 font-medium">{log.trade}</span>
                  </div>
                  <div className="px-2 text-center">
                    <span className="font-extrabold text-brand-blue text-lg md:text-sm">{log.count}</span>
                    <span className="text-[10px] text-gray-400 ml-1 font-bold">명</span>
                  </div>
                  <div className="px-0 md:px-2 flex justify-center">
                    <button 
                      onClick={() => onDelete(log.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-2 md:p-1"
                    >
                      <Trash2 size={18} className="md:size-4" />
                    </button>
                  </div>
                </div>
              ))}
              {todayLogs.length === 0 && (
                <div className="p-16 text-center text-gray-300 text-xs italic flex flex-col items-center gap-2">
                  <Users size={32} className="opacity-20" />
                   금일 입력된 인원 정보가 없습니다.
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4 border-l-4 border-l-brand-blue flex md:flex-col justify-between md:justify-start items-center md:items-start">
              <p className="text-[11px] font-bold text-gray-400 uppercase">누적 총원 (ALL TIME)</p>
              <div className="flex items-baseline gap-1 md:mt-1">
                <span className="text-2xl font-extrabold text-gray-900">{logs.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}</span>
                <span className="text-xs text-gray-400 font-bold uppercase">PERS</span>
              </div>
            </div>
            <div className="card p-4 flex md:flex-col justify-between md:justify-start items-center md:items-start">
              <p className="text-[11px] font-bold text-gray-400 uppercase">최다 투입 업체</p>
              <div className="md:mt-1 text-right md:text-left">
                <span className="text-sm font-bold text-gray-700">{topPartner.name}</span>
                {topPartner.count > 0 && <span className="text-[10px] text-brand-blue font-bold ml-2">({topPartner.count.toLocaleString()}명)</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

