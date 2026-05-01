/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ProductivityLog } from '../types';
import { Calculator, Activity, ArrowUpRight, ArrowDownRight, Percent, Target, Zap, Plus, Trash2, Calendar, Save, CheckCircle2 } from 'lucide-react';

interface Props {
  logs: ProductivityLog[];
  onSave: (log: ProductivityLog) => void;
  onDelete: (id: string) => void;
  onSaveAndClose?: () => void;
}

export default function ProductivityCalculator({ logs, onSave, onDelete, onSaveAndClose }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [showSaved, setShowSaved] = useState(false);
  const [formData, setFormData] = useState<Omit<ProductivityLog, 'id' | 'siteId'>>({
    date: today,
    plannedWork: 100,
    actualWork: 0,
    manpower: 10,
    unit: 'm2'
  });

  const handlePageSave = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      onSaveAndClose?.();
    }, 1000);
  };

  const efficiency = formData.plannedWork > 0 
    ? (formData.actualWork / formData.plannedWork) * 100 
    : 0;

  const manpowerProductivity = formData.manpower > 0 
    ? (formData.actualWork / formData.manpower) 
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: `prod-${Date.now()}`,
      siteId: '' // Set by parent
    } as ProductivityLog);
    alert('실적이 저장되었습니다.');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic italic">Productivity & Efficiency Analysis</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">공정 효율 지수 및 1인당 생산성 관리</p>
        </div>
        <button 
          onClick={handlePageSave}
          className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${showSaved ? 'bg-green-500 text-white' : 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95'}`}
        >
          {showSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {showSaved ? '분석 데이터 저장됨' : '현재 상태 저장'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Card */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="card p-8 space-y-6 bg-white border-none shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="text-brand-blue" />
              <h3 className="text-sm font-black uppercase tracking-wider">실적 입력기</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2">
                  <Calendar size={12} /> 날짜
                </label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2">
                  <Target size={12} /> 계획 물량 (Target)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.plannedWork}
                    onChange={e => setFormData({...formData, plannedWork: Number(e.target.value)})}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">{formData.unit}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2">
                  <Zap size={12} /> 실행 물량 (Actual)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.actualWork}
                    onChange={e => setFormData({...formData, actualWork: Number(e.target.value)})}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">{formData.unit}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2">
                  단위 (Unit)
                </label>
                <select 
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none appearance-none"
                >
                  <option value="m2">m² (면적)</option>
                  <option value="m">m (길이)</option>
                  <option value="EA">EA (개수)</option>
                  <option value="kg">kg (무게)</option>
                  <option value="ton">ton (톤)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-2">
                  투입 인원 (Manpower)
                </label>
                <input 
                  type="number" 
                  value={formData.manpower}
                  onChange={e => setFormData({...formData, manpower: Number(e.target.value)})}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase shadow-xl shadow-brand-blue/20 hover:shadow-2xl transition-all active:scale-95"
            >
              실적 데이터 등록
            </button>
          </form>
        </div>

        {/* Results & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-6 bg-white border-none shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Efficiency Rate</span>
                <Percent size={18} className="text-brand-blue" />
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-black tracking-tighter ${efficiency >= 100 ? 'text-green-500' : 'text-brand-orange'}`}>
                    {efficiency.toFixed(1)}
                  </span>
                  <span className="text-sm font-extrabold text-gray-400">%</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-2">
                  계획 대비 {efficiency >= 100 ? '초과 달성' : '미달'}
                </p>
              </div>
            </div>

            <div className="card p-6 bg-white border-none shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Output per Head</span>
                <Activity size={18} className="text-brand-blue" />
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter text-gray-900">
                    {manpowerProductivity.toFixed(2)}
                  </span>
                  <span className="text-sm font-extrabold text-gray-400">{formData.unit}/명</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-2">
                  1인당 평균 생산성
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-white border-none shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-wider">최근 실적 기록</h3>
              <span className="text-[10px] font-black text-gray-300 uppercase">{logs.length} Records</span>
            </div>
            <div className="divide-y divide-gray-50">
              {logs.slice().reverse().map((log) => {
                const logEfficiency = (log.actualWork / log.plannedWork) * 100;
                return (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex flex-col items-center justify-center">
                        <span className="text-[9px] font-black text-gray-400">{log.date.split('-')[1]}</span>
                        <span className="text-sm font-black text-gray-900 leading-none">{log.date.split('-')[2]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-gray-900">{log.actualWork} {log.unit}</span>
                          <span className="text-[10px] font-bold text-gray-400">/ 계획 {log.plannedWork} {log.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-gray-500">{log.manpower}명 투입</span>
                          <span className={`text-[10px] font-black flex items-center gap-0.5 ${logEfficiency >= 100 ? 'text-green-500' : 'text-red-500'}`}>
                            {logEfficiency >= 100 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                            {logEfficiency.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDelete(log.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
              {logs.length === 0 && (
                <div className="p-12 text-center text-gray-300">
                  <p className="text-xs font-bold italic">등록된 실적 데이터가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
