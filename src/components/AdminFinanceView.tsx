/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Site, AdminFinance } from '../types';
import { Building2, DollarSign, AlertTriangle, Save, TrendingUp, CreditCard, Users, CheckCircle2 } from 'lucide-react';

interface Props {
  site: Site;
  finance?: AdminFinance;
  onUpdate: (fin: AdminFinance) => void;
  onSaveAndClose?: () => void;
}

export default function AdminFinanceView({ site, finance, onUpdate, onSaveAndClose }: Props) {
  const [showSaved, setShowSaved] = useState(false);
  // If no finance data exists, initialize with site partners
  const initialPartnerPayments = site.partners.reduce((acc, p) => {
    acc[p] = finance?.partnerPayments[p] || {
      contractAmount: 0,
      advance: 0,
      interim: 0,
      balance: 0,
      status: 'pending'
    };
    return acc;
  }, {} as any);

  const [localFinance, setLocalFinance] = useState<AdminFinance>(finance || {
    siteId: site.id,
    budget: site.contractAmount,
    actualCost: 0,
    laborUnitCosts: {},
    partnerPayments: initialPartnerPayments
  });

  const updatePartnerField = (partner: string, field: string, value: number) => {
    setLocalFinance({
      ...localFinance,
      partnerPayments: {
        ...localFinance.partnerPayments,
        [partner]: {
          ...localFinance.partnerPayments[partner],
          [field]: value
        }
      }
    });
  };

  const calculateTotalPaid = (payment: any) => {
    return (payment.advance || 0) + (payment.interim || 0);
  };

  const handleSave = () => {
    onUpdate(localFinance);
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      onSaveAndClose?.();
    }, 1000);
  };

  const totalContract = Object.values(localFinance.partnerPayments).reduce((acc: number, p: any) => acc + (Number(p.contractAmount) || 0), 0);
  const totalPaid = Object.values(localFinance.partnerPayments).reduce((acc: number, p: any) => acc + calculateTotalPaid(p), 0);
  const totalBalance = Object.values(localFinance.partnerPayments).reduce((acc: number, p: any) => acc + (Number(p.balance) || 0), 0);

  const totalContractValue = Number(totalContract);
  const totalPaidValue = Number(totalPaid);
  const totalBalanceValue = Number(totalBalance);

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20 md:pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">업체 결재액 및 재무 관리</h2>
          <p className="text-xs text-gray-500 mt-1">계약금액 대비 기성 집행 현황을 상세하게 관리합니다.</p>
        </div>
        <button 
          onClick={handleSave} 
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all ${showSaved ? 'bg-green-500 text-white' : 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95'}`}
        >
          {showSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {showSaved ? '재무 정보 저장됨' : '설정 저장하기'}
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <FinanceStatCard label="총 실행 예산 (계약)" value={totalContractValue} icon={Building2} color="blue" />
        <FinanceStatCard label="총 기성 지급액 (누계)" value={totalPaidValue} icon={DollarSign} color="green" trend={`${((totalPaidValue / (totalContractValue || 1)) * 100).toFixed(1)}% 집행`} />
        <FinanceStatCard label="총 잔액 (미지급)" value={totalBalanceValue} icon={AlertTriangle} color="orange" trend={`잔여: ${(totalContractValue - totalPaidValue).toLocaleString()}`} />
      </div>

      <div className="card p-0 md:overflow-hidden shadow-xl border-none">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-sidebar-dark text-white text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 sticky left-0 bg-sidebar-dark shadow-[2px_0_5px_rgba(0,0,0,0.1)]">협력 업체명</th>
                <th className="px-4 py-4 text-center">계약 금액 (A)</th>
                <th className="px-4 py-4 text-center bg-blue-900/20">선금 (B)</th>
                <th className="px-4 py-4 text-center bg-blue-900/20">중도금 (C)</th>
                <th className="px-4 py-4 text-center bg-green-900/20">기성 누계 (B+C)</th>
                <th className="px-4 py-4 text-center bg-orange-900/20">잔금 (D)</th>
                <th className="px-4 py-4 text-center">지급 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {site.partners.map((partner, i) => {
                const payment = localFinance.partnerPayments[partner] || {};
                const paid = calculateTotalPaid(payment);
                
                return (
                  <tr key={partner} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900 sticky left-0 bg-white group-hover:bg-blue-50/30 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">{partner}</td>
                    <td className="px-2 py-3">
                      <input 
                        type="number" 
                        value={payment.contractAmount || 0}
                        onChange={e => updatePartnerField(partner, 'contractAmount', Number(e.target.value))}
                        className="w-full text-right bg-transparent border-none focus:ring-1 focus:ring-blue-100 rounded px-2 font-mono font-bold"
                      />
                    </td>
                    <td className="px-2 py-3 bg-blue-50/30">
                      <input 
                        type="number" 
                        value={payment.advance || 0}
                        onChange={e => updatePartnerField(partner, 'advance', Number(e.target.value))}
                        className="w-full text-right bg-transparent border-none focus:ring-1 focus:ring-blue-100 rounded px-2 font-mono text-blue-700"
                      />
                    </td>
                    <td className="px-2 py-3 bg-blue-50/30">
                      <input 
                        type="number" 
                        value={payment.interim || 0}
                        onChange={e => updatePartnerField(partner, 'interim', Number(e.target.value))}
                        className="w-full text-right bg-transparent border-none focus:ring-1 focus:ring-blue-100 rounded px-2 font-mono text-blue-700"
                      />
                    </td>
                    <td className="px-4 py-3 bg-green-50/30 text-right font-black text-green-700 font-mono">
                      {paid.toLocaleString()}
                    </td>
                    <td className="px-2 py-3 bg-orange-50/30">
                      <input 
                         type="number" 
                         value={payment.balance || 0}
                         onChange={e => updatePartnerField(partner, 'balance', Number(e.target.value))}
                         className="w-full text-right bg-transparent border-none focus:ring-1 focus:ring-orange-100 rounded px-2 font-mono text-brand-orange font-bold"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`badge ${paid >= (payment.contractAmount || -1) ? 'bg-green-100 text-green-700' : paid > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} text-[10px]`}>
                        {paid >= (payment.contractAmount || -1) && payment.contractAmount > 0 ? '지급완료' : paid > 0 ? '부분지급' : '대기중'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List */}
        <div className="md:hidden divide-y divide-gray-100 h-full overflow-y-auto">
          {site.partners.map((partner, i) => {
            const payment = localFinance.partnerPayments[partner] || {};
            const paid = calculateTotalPaid(payment);
            
            return (
              <div key={partner} className="p-4 space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-900">{partner}</h3>
                  <span className={`badge ${paid >= (payment.contractAmount || -1) ? 'bg-green-100 text-green-700' : paid > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} text-[10px]`}>
                    {paid >= (payment.contractAmount || -1) && payment.contractAmount > 0 ? '지급완료' : paid > 0 ? '부분지급' : '대기중'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">계약 금액 (A)</label>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      value={payment.contractAmount || 0}
                      onChange={e => updatePartnerField(partner, 'contractAmount', Number(e.target.value))}
                      className="w-full bg-gray-50 border border-border-gray rounded-lg px-3 py-3 text-base font-bold font-mono focus:ring-2 focus:ring-brand-blue/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">잔금 (D)</label>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      value={payment.balance || 0}
                      onChange={e => updatePartnerField(partner, 'balance', Number(e.target.value))}
                      className="w-full bg-orange-50 border border-orange-100 rounded-lg px-3 py-3 text-base font-bold font-mono text-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-500 uppercase">선금 (B)</label>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      value={payment.advance || 0}
                      onChange={e => updatePartnerField(partner, 'advance', Number(e.target.value))}
                      className="w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-3 text-base font-mono text-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-blue-500 uppercase">중도금 (C)</label>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      value={payment.interim || 0}
                      onChange={e => updatePartnerField(partner, 'interim', Number(e.target.value))}
                      className="w-full bg-blue-50/50 border border-blue-100 rounded-lg px-3 py-3 text-base font-mono text-blue-700 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-green-600 uppercase">기성 누계 (B+C)</span>
                  <span className="text-lg font-black text-green-700 font-mono">₩{paid.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 text-gray-700">
            <Users size={16} /> 노무비 단가 관리
          </h3>
          <div className="space-y-2">
            {['목수', '철근', '콘크리트', '본동', '일반공'].map(trade => (
              <div key={trade} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                <span className="font-medium text-gray-600">{trade}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400">₩</span>
                  <input 
                    type="number" 
                    defaultValue={localFinance.laborUnitCosts[trade] || 0}
                    onBlur={e => {
                      setLocalFinance({
                        ...localFinance,
                        laborUnitCosts: { ...localFinance.laborUnitCosts, [trade]: Number(e.target.value) }
                      });
                    }}
                    className="w-24 text-right bg-white border border-gray-200 rounded px-2 py-1 font-mono text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 italic mt-2">* 설정된 단가는 자동 노무비 계산에 반영됩니다.</p>
        </div>

        <div className="card bg-gray-900 text-white border-none space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 text-gray-400">
            <TrendingUp size={16} /> 재무 요약 리포트
          </h3>
          <div className="space-y-3">
             <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                <span className="text-gray-400">전체 집행률</span>
                <span className="font-mono font-bold text-brand-blue">{((totalPaidValue / (totalContractValue || 1)) * 100).toFixed(2)}%</span>
             </div>
             <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                <span className="text-gray-400">미집행 잔액</span>
                <span className="font-mono font-bold text-brand-orange">₩{(totalContractValue - totalPaidValue).toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">참여 업체 수</span>
                <span className="font-bold">{site.partners.length}개사</span>
             </div>
          </div>
        </div>
        <div className="card border-dashed border-2 flex flex-col items-center justify-center text-center p-8 text-gray-400">
           <CreditCard size={32} className="mb-2 opacity-20" />
           <p className="text-xs font-bold uppercase tracking-widest">전자 결재 시스템 연동 준비 중</p>
           <p className="text-[10px] mt-1 opacity-50">법인 카드 및 세금계산서 발행 시스템과 통합됩니다.</p>
        </div>
      </div>
    </div>
  );
}

function FinanceStatCard({ label, value, icon: Icon, color, trend }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-brand-blue border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    orange: 'bg-orange-50 text-brand-orange border-orange-100'
  };

  return (
    <div className={`card border-none shadow-sm ${colors[color]} p-5`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-bold uppercase opacity-70">{label}</span>
        <Icon size={18} className="opacity-50" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-xs opacity-60">₩</span>
          <span className="text-2xl font-black tracking-tight leading-none">{value.toLocaleString()}</span>
        </div>
        {trend && <div className="text-[10px] font-bold mt-2 bg-white/50 w-fit px-2 py-0.5 rounded-full">{trend}</div>}
      </div>
    </div>
  );
}
