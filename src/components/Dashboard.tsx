/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Site, WorkLog, PersonnelLog, EquipmentLog, MaterialLog, Photo, AdminFinance, WeeklySchedule, Appointment, OrderItem, ProjectMemo } from '../types';
import { 
  ClipboardList, 
  Users, 
  Truck, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Building2,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  ShoppingCart,
  Camera,
  Plus,
  Save,
  FileText as FileTextIcon
} from 'lucide-react';
import { useState, useRef, ChangeEvent } from 'react';
import WorkLogForm from './WorkLogForm';
import PersonnelForm from './PersonnelForm';
import EquipmentForm from './EquipmentForm';
import MaterialForm from './MaterialForm';
import ReportView from './ReportView';
import ProjectScheduleView from './ProjectScheduleView';
import ScheduleManagement from './ScheduleManagement';
import AdminFinanceView from './AdminFinanceView';
import BlueprintsView from './BlueprintsView';

interface Props {
  site: Site;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  logs: {
    work: WorkLog[];
    personnel: PersonnelLog[];
    equipment: EquipmentLog[];
    material: MaterialLog[];
    photos: Photo[];
    finance?: AdminFinance;
    weeklySchedules: WeeklySchedule[];
    memos: ProjectMemo[];
    appointments: Appointment[];
    orders: OrderItem[];
  };
  onUpdateWorkLog: (log: WorkLog) => void;
  onUpdatePersonnel: (log: PersonnelLog) => void;
  onUpdateEquipment: (log: EquipmentLog) => void;
  onUpdateMaterial: (log: MaterialLog) => void;
  onUpdateFinance: (fin: AdminFinance) => void;
  onUpdatePhotos: (photo: Photo) => void;
  onDeletePersonnel: (id: string) => void;
  onDeleteEquipment: (id: string) => void;
  onDeleteMaterial: (id: string) => void;
  onUpdateWeeklySchedule: (log: WeeklySchedule) => void;
  onDeleteWeeklySchedule: (id: string) => void;
  onUpdateMemo: (memo: ProjectMemo) => void;
  onDeleteMemo: (id: string) => void;
  onUpdateAppointment: (app: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateOrder: (order: OrderItem) => void;
  onDeleteOrder: (id: string) => void;
  isAdminMode: boolean;
}

export default function Dashboard({ 
  site, 
  logs, 
  activeTab, 
  setActiveTab, 
  onUpdateWorkLog, 
  onUpdatePersonnel, 
  onUpdateEquipment, 
  onUpdateMaterial, 
  onDeletePersonnel,
  onDeleteEquipment,
  onDeleteMaterial,
  onUpdateWeeklySchedule,
  onDeleteWeeklySchedule,
  onUpdateMemo,
  onDeleteMemo,
  onUpdateAppointment,
  onDeleteAppointment,
  onUpdateOrder,
  onDeleteOrder,
  onUpdateFinance,
  onUpdatePhotos,
  isAdminMode 
}: Props) {
  const today = new Date().toISOString().split('T')[0];
  const latestLog = logs.work.find(l => l.date === today) || logs.work[logs.work.length - 1];
  
  const [todayText, setTodayText] = useState(latestLog?.todayWork || '');
  const [tomorrowText, setTomorrowText] = useState(latestLog?.tomorrowWork || '');
  const [isSaving, setIsSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Calculate dynamic stats
  const getStats = () => {
    try {
      const now = new Date();
      if (!site.startDate || !site.endDate) {
        return { progress: '0.0', dDay: 0, endDate: '-' };
      }
      const start = new Date(site.startDate);
      const end = new Date(site.endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { progress: '0.0', dDay: 0, endDate: '-' };
      }

      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const dDay = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
      
      return {
        progress: progress.toFixed(1),
        dDay: dDay,
        endDate: site.endDate
      };
    } catch (e) {
      console.error("Stats calculation error:", e);
      return { progress: '0.0', dDay: 0, endDate: '-' };
    }
  };

  const stats = getStats();

  // Dynamic Safety Rules based on trades
  const getDynamicSafetyRules = () => {
    const todayPersonnel = logs.personnel.filter(l => l.date === new Date().toISOString().split('T')[0]);
    const trades = todayPersonnel.map(p => p.trade);
    
    const rules = [
      { key: '철근', rule: '철근 가공 및 조립 시 찔림 주의 (보호구 필수)' },
      { key: '목수', rule: '고소 작업 시 생명줄 착용 및 안전발판 확인' },
      { key: '전기', rule: '활선 작업 시 절연장구 착용 및 화재 예방' },
      { key: '기계', rule: '장비 선회 반경 내 출입 금지 및 유도원 배치' },
      { key: '도장', rule: '밀폐 공간 환기 철저 및 인화성 물질 격리' },
      { key: '타일', rule: '자재 양중 시 하부 통제 및 과적 금지' }
    ];

    const matched = rules.filter(r => trades.some(t => t.includes(r.key)));
    
    // Default fallback rules
    const defaultRules = [
      '현장 내 전구역 금연 (위반 시 즉시 퇴출)',
      '화기 작업 전 사전 승인 및 감시원 배치'
    ];

    return matched.length > 0 ? matched.map(m => m.rule) : defaultRules;
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPhoto: Photo = {
        id: Math.random().toString(36).substr(2, 9),
        siteId: site.id,
        date: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file),
        description: '현장 모바일 업로드'
      };
      onUpdatePhotos(newPhoto);
    }
  };

  const saveWorkPlan = () => {
    setIsSaving(true);
    const newLog: WorkLog = {
      ...(latestLog || { 
        id: Math.random().toString(36).substr(2, 9), 
        siteId: site.id, 
        date: today, 
        weather: '맑음' 
      }),
      todayWork: todayText,
      tomorrowWork: tomorrowText
    };
    onUpdateWorkLog(newLog);
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case '대시보드':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <StatCard 
                label="금일 인원" 
                value={logs.personnel.filter(l => l.date === today).reduce((acc, curr) => acc + curr.count, 0)} 
                unit="명" 
                icon={Users} 
                trend={`${logs.personnel.filter(l => l.date === today).length}개 업체`}
                trendPositive
              />
              <StatCard 
                label="금일 장비" 
                value={logs.equipment.filter(l => l.date === today).reduce((acc, curr) => acc + curr.count, 0)} 
                unit="대" 
                icon={Truck} 
                trend={`${logs.equipment.filter(l => l.date === today).length}종 투입`}
              />
              <StatCard 
                label="공정 진행" 
                value={stats.progress} 
                unit="%" 
                icon={TrendingUp} 
                progress={Number(stats.progress)}
              />
              <StatCard 
                label="잔여 공기" 
                value={stats.dDay} 
                unit="일" 
                prefix="D-"
                icon={Calendar} 
                trend={stats.endDate}
                trendWarning={stats.dDay < 30}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="card h-full flex flex-col p-4 md:p-6 bg-white shadow-sm border-none">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
                    <h3 className="text-base font-black flex items-center gap-2">
                      <ClipboardList size={18} className="text-brand-blue" />
                      금일 주요 작업
                    </h3>
                    <button 
                      onClick={saveWorkPlan}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 bg-brand-blue text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-lg shadow-brand-blue/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isSaving ? <Clock size={14} className="animate-spin" /> : <Save size={14} />}
                      작업 저장
                    </button>
                  </div>
                  
                  <textarea 
                    value={todayText}
                    onChange={e => setTodayText(e.target.value)}
                    placeholder="오늘 진행 중인 주요 공사 내용을 입력하세요..."
                    className="w-full flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-brand-blue/20 outline-none resize-none min-h-[120px] md:min-h-[160px]"
                  />
                  
                  <div className="mt-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       투입 인원 현황 ({logs.personnel.filter(l => l.date === today).length}개 팀)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {logs.personnel.filter(l => l.date === today).map((p, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 flex flex-col">
                          <span className="text-[9px] font-black text-brand-blue uppercase">{p.trade}</span>
                          <span className="text-xs font-extrabold text-gray-900 truncate">{p.partnerName}</span>
                          <span className="text-[10px] text-gray-400 mt-1">{p.count}명 투입</span>
                        </div>
                      ))}
                      {logs.personnel.filter(l => l.date === today).length === 0 && (
                        <div className="col-span-full py-4 text-center text-gray-300 text-[10px] font-bold border-2 border-dashed border-gray-50 rounded-xl">
                          오늘의 투입 인원 정보가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="card bg-gradient-to-br from-indigo-500 to-brand-blue p-5 text-white shadow-xl shadow-brand-blue/20 border-none relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Clock size={80} />
                  </div>
                  <h4 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock size={14} /> 명일 작업 예정
                  </h4>
                  <textarea 
                    value={tomorrowText}
                    onChange={e => setTomorrowText(e.target.value)}
                    placeholder="내일 진행할 주요 공정 계획을 입력하세요..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-sm font-bold text-white placeholder:text-white/40 focus:bg-white/20 outline-none resize-none min-h-[140px]"
                  />
                  <button 
                    onClick={saveWorkPlan}
                    className="w-full mt-4 bg-white text-brand-blue py-2.5 rounded-xl text-xs font-black shadow-xl active:scale-95 transition-all"
                  >
                    내일 계획 확정
                  </button>
                </div>
                <div className="card bg-gray-50/50 p-4 md:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold">최근 현장 사진</h3>
                    <button 
                      onClick={() => photoInputRef.current?.click()}
                      className="p-2 bg-brand-blue text-white rounded-lg hover:shadow-lg transition-all active:scale-95"
                    >
                      <Camera size={18} />
                    </button>
                    <input 
                      type="file" 
                      ref={photoInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handlePhotoUpload} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {logs.photos.slice(-4).map((p, i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden border border-gray-100 group relative">
                        <img src={p.url} alt={p.description} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[8px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {p.description}
                        </div>
                      </div>
                    ))}
                    {logs.photos.length < 4 && Array.from({ length: 4 - logs.photos.length }).map((_, i) => (
                      <div 
                        key={`empty-${i}`} 
                        onClick={() => photoInputRef.current?.click()}
                        className="aspect-square bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-300 gap-1 cursor-pointer hover:bg-gray-200 transition-all"
                      >
                        <Plus size={20} />
                        <span className="text-[9px] font-black">UPLOAD</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="space-y-3 text-[12px] text-gray-600 leading-normal">
                      <p className="flex items-center gap-2 font-medium"><MapPin size={14} className="text-brand-blue shrink-0" /> {site.address}</p>
                      <p className="flex items-center gap-2 font-medium"><Users size={14} className="text-brand-blue shrink-0" /> 현장소장: {site.manager}</p>
                      <p className="flex items-center gap-2 font-medium"><Building2 size={14} className="text-brand-blue shrink-0" /> 시공사: {site.contractor}</p>
                    </div>
                  </div>
                </div>

                <div className="card bg-orange-50 border-brand-orange/20 p-4 md:p-6 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <AlertTriangle size={80} />
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-brand-orange font-bold uppercase text-[11px]">
                    <AlertTriangle size={14} /> 현장 맞춤형 위험성 평가 & 안전 가이드
                  </div>
                  <ul className="space-y-2 text-[11px] text-orange-900/80 list-disc pl-4 font-bold relative z-10">
                    {getDynamicSafetyRules().map((rule, idx) => (
                      <li key={idx} className="animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                        {rule}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-orange-200/50">
                    <h4 className="text-[10px] font-black text-brand-orange/60 uppercase mb-2">오늘의 주요 안전 지시</h4>
                    <div className="bg-white/40 rounded-lg p-3 text-[11px] font-bold text-brand-orange">
                      현장 내 {logs.personnel.filter(l => l.date === today).length}개 팀이 작업 중입니다. 
                      차량 이동 통로 확보 및 개인 보호구 착용 상태를 상시 점검하십시오.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case '공사일보 작성':
        return <WorkLogForm logs={logs.work} onSave={(log) => onUpdateWorkLog({...log, siteId: site.id})} />;
      case '인원 투입':
        return <PersonnelForm logs={logs.personnel} partners={site.partners} onSave={(log) => onUpdatePersonnel({...log, siteId: site.id})} onDelete={onDeletePersonnel} />;
      case '장비 투입':
        return <EquipmentForm logs={logs.equipment} onSave={(log) => onUpdateEquipment({...log, siteId: site.id})} onDelete={onDeleteEquipment} />;
      case '자재 반입·반출':
        return <MaterialForm logs={logs.material} onSave={(log) => onUpdateMaterial({...log, siteId: site.id})} onDelete={onDeleteMaterial} />;
      case '보고서 출력':
        return <ReportView site={site} logs={logs} />;
      case '일반 공정표':
        return (
          <ProjectScheduleView 
            weeklyLogs={logs.weeklySchedules} 
            memos={logs.memos} 
            onSaveWeekly={onUpdateWeeklySchedule}
            onDeleteWeekly={onDeleteWeeklySchedule}
            onSaveMemo={onUpdateMemo}
            onDeleteMemo={onDeleteMemo}
          />
        );
      case '현장 도면 [PDF]':
        return <BlueprintsView siteId={site.id} />;
      case '스케줄 관리':
        return (
          <ScheduleManagement 
            appointments={logs.appointments} 
            orders={logs.orders} 
            onUpdateAppointments={onUpdateAppointment} 
            onUpdateOrders={onUpdateOrder}
            onDeleteAppointment={onDeleteAppointment}
            onDeleteOrder={onDeleteOrder}
          />
        );
      case '업체 결재액 관리':
        return <AdminFinanceView site={site} finance={logs.finance} onUpdate={onUpdateFinance} />;
      default:
        return <PlaceholderView title={activeTab} />;
    }
  };

  return renderContent();
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-24 text-gray-300">
      <Building2 size={64} className="mb-4 opacity-20" />
      <p className="text-lg font-bold uppercase tracking-widest opacity-30">{title} 준비 중</p>
      <p className="text-xs mt-2 opacity-20">해당 기능은 현재 개발 중입니다.</p>
    </div>
  );
}

function StatCard({ label, value, unit, icon: Icon, trend, trendPositive, trendWarning, progress, prefix }: any) {
  return (
    <div className="card p-4 md:p-5 flex flex-col justify-between h-[120px] md:h-32 hover:shadow-lg transition-all cursor-pointer group bg-white border-none shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start">
        <span className="text-[10px] md:text-[12px] font-black uppercase text-gray-400 tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg transition-colors ${trendPositive ? 'bg-green-50 text-green-600' : trendWarning ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-brand-blue'}`}>
          <Icon size={16} className="md:size-5" />
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex items-baseline gap-0.5 md:gap-1">
          {prefix && <span className="text-sm md:text-lg font-black text-gray-400">{prefix}</span>}
          <span className="text-xl md:text-3xl font-black tracking-tighter text-gray-900">{value}</span>
          <span className="text-[10px] md:text-sm font-bold text-gray-400 ml-0.5">{unit}</span>
        </div>
        {progress !== undefined ? (
          <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        ) : trend ? (
          <div className={`text-[9px] md:text-[11px] font-bold mt-1.5 flex items-center gap-1 ${trendPositive ? 'text-green-600' : trendWarning ? 'text-brand-orange' : 'text-blue-500'}`}>
            <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
            {trend}
          </div>
        ) : null}
      </div>
    </div>
  );
}


function ShieldAlert({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
