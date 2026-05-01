/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { EquipmentLog } from '../types';
import { Truck, Plus, Trash2 } from 'lucide-react';

interface Props {
  logs: EquipmentLog[];
  onSave: (log: EquipmentLog) => void;
  onDelete: (id: string) => void;
}

export default function EquipmentForm({ logs, onSave, onDelete }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [name, setName] = useState('');
  const [spec, setSpec] = useState('');
  const [count, setCount] = useState(1);

  const handleAdd = () => {
    if (!name ) return;
    onSave({
      id: `eq-${Date.now()}`,
      siteId: '',
      date: today,
      name,
      spec,
      count
    });
    setName('');
    setSpec('');
    setCount(1);
  };

  const todayLogs = logs.filter(l => l.date === today);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">장비 투입 관리</h2>
          <p className="text-xs text-gray-500 mt-1">현장에 투입된 중장비 및 차량 현황을 기록합니다.</p>
        </div>
        <div className="text-right text-[11px] text-gray-400 font-medium font-sans">
          기준일: {today} | 금일 총 {todayLogs.reduce((acc, curr) => acc + curr.count, 0)}대 가동
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">장비 정보 입력</h3>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 block">장비명</label>
              <input 
                type="text"
                placeholder="예: 백호(06), 덤프(15t)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-50 border border-border-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-gray-300 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 block">규격/상태</label>
              <input 
                type="text"
                placeholder="예: 0.6m3, 양호"
                value={spec}
                onChange={e => setSpec(e.target.value)}
                className="w-full bg-gray-50 border border-border-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-gray-300 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 block">수량 (대)</label>
              <input 
                type="number"
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full bg-gray-50 border border-border-gray rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-bold"
              />
            </div>
            <button 
              onClick={handleAdd}
              disabled={!name}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2 shadow-md shadow-brand-blue/10"
            >
              <Plus size={16} /> 장비 추가하기
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
             <div className="grid grid-cols-[1.2fr_1fr_60px_60px] bg-sidebar-dark text-white text-[11px] font-bold p-3 uppercase tracking-wider">
              <div className="px-2">장비명</div>
              <div className="px-2">규격</div>
              <div className="px-2 text-center">수량</div>
              <div className="px-2 text-center">관리</div>
            </div>
            <div className="bg-white divide-y divide-gray-50">
              {todayLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-[1.2fr_1fr_60px_60px] items-center p-3 text-sm hover:bg-blue-50/30 transition-colors">
                  <div className="px-2 font-bold text-gray-900">{log.name}</div>
                  <div className="px-2 text-xs text-gray-500 italic">{log.spec}</div>
                  <div className="px-2 text-center font-extrabold text-brand-blue">{log.count}</div>
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
                <div className="p-16 text-center text-gray-300 text-xs italic flex flex-col items-center gap-2">
                  <Truck size={32} className="opacity-20" />
                  금일 가동 장비 정보가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

