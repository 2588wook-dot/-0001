/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MaterialLog } from '../types';
import { Package, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';

interface Props {
  logs: MaterialLog[];
  onSave: (log: MaterialLog) => void;
  onDelete: (id: string) => void;
  onSaveAndClose?: () => void;
}

export default function MaterialForm({ logs, onSave, onDelete, onSaveAndClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('');
  const [spec, setSpec] = useState('');
  const [unit, setUnit] = useState('EA');
  const [inCount, setInCount] = useState(0);
  const [outCount, setOutCount] = useState(0);
  const [showSaved, setShowSaved] = useState(false);

  const handlePageSave = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      onSaveAndClose?.();
    }, 1000);
  };

  const handleAdd = () => {
    if (!name ) return;
    onSave({
      id: `mat-${Date.now()}`,
      siteId: '',
      date: today,
      name,
      spec,
      unit,
      inCount,
      outCount
    });
    setName('');
    setSpec('');
    setInCount(0);
    setOutCount(0);
  };

  const todayLogs = logs.filter(l => l.date === today);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
        <div className="flex justify-between w-full md:w-auto items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight">자재 반입·반출 관리</h2>
            <p className="text-xs text-gray-500 mt-1">현장에 반입되거나 반출되는 주요 자재 현황을 실시간으로 기록합니다.</p>
          </div>
          <button 
            onClick={handlePageSave}
            className={`md:hidden flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${showSaved ? 'bg-green-500 text-white' : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'}`}
          >
            {showSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {showSaved ? '저장됨' : '저장'}
          </button>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-right text-[11px] text-gray-400 font-medium">
            기준일: {today}
          </div>
          <button 
            onClick={handlePageSave}
            className={`hidden md:flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${showSaved ? 'bg-green-500 text-white' : 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95'}`}
          >
            {showSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {showSaved ? '현 페이지 저장' : '데이터 저장'}
          </button>
        </div>
      </header>

      <div className="card bg-gray-50/30">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">자재 변동사항 입력</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-gray-600 block">품명</label>
            <input 
              type="text" 
              placeholder="예: 레미콘, 철근(D10), 시멘트"
              value={name} 
              onChange={e=>setName(e.target.value)} 
              className="w-full bg-white border border-border-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600 block">규격</label>
            <input 
              type="text" 
              placeholder="예: 25-24-150"
              value={spec} 
              onChange={e=>setSpec(e.target.value)} 
              className="w-full bg-white border border-border-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-600 block">단위</label>
            <input 
              type="text" 
              placeholder="예: m3, t, box"
              value={unit} 
              onChange={e=>setUnit(e.target.value)} 
              className="w-full bg-white border border-border-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium" 
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-blue-600 block">반입 (+)</label>
              <input 
                type="number" 
                value={inCount} 
                onChange={e=>setInCount(Number(e.target.value))} 
                className="w-full bg-blue-50 border border-blue-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-blue-700" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-red-600 block">반출 (-)</label>
              <input 
                type="number" 
                value={outCount} 
                onChange={e=>setOutCount(Number(e.target.value))} 
                className="w-full bg-red-50 border border-red-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold text-red-700" 
              />
            </div>
          </div>
          <button 
            onClick={handleAdd} 
            disabled={!name}
            className="btn-primary flex items-center justify-center gap-2 mb-[1px]"
          >
            <Plus size={16} /> 추가
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-md">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_60px] bg-sidebar-dark text-white text-[11px] font-bold p-3 uppercase tracking-wider">
          <div className="px-2">품명 / 규격</div>
          <div className="px-2 text-center">단위</div>
          <div className="px-2 text-center text-blue-300">반입 (+)</div>
          <div className="px-2 text-center text-red-300">반출 (-)</div>
          <div className="px-2 text-center">금일 변동</div>
          <div className="px-2 text-center">삭제</div>
        </div>
        <div className="bg-white divide-y divide-gray-50">
          {todayLogs.map(log => (
            <div key={log.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_60px] items-center p-4 text-sm hover:bg-blue-50/30 transition-colors">
              <div className="px-2">
                <span className="font-bold text-gray-900">{log.name}</span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-2 font-medium italic">{log.spec}</span>
              </div>
              <div className="px-2 text-center font-medium text-gray-400">{log.unit}</div>
              <div className="px-2 text-center text-blue-600 font-extrabold">{log.inCount > 0 ? `+${log.inCount}` : '-'}</div>
              <div className="px-2 text-center text-red-600 font-extrabold">{log.outCount > 0 ? `-${log.outCount}` : '-'}</div>
              <div className="px-2 text-center font-extrabold text-gray-900 bg-gray-50/50 rounded py-1">{log.inCount - log.outCount}</div>
              <div className="px-2 flex justify-center">
                <button 
                  onClick={() => onDelete(log.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {todayLogs.length === 0 && (
            <div className="p-20 text-center text-gray-300 text-xs italic flex flex-col items-center gap-2">
               <Package size={32} className="opacity-20" />
               금일 반입·반출 내역이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

