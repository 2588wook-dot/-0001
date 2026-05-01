/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Appointment, OrderItem } from '../types';
import { Calendar, Package, Plus, Trash2, CheckCircle2, ShoppingCart, Clock } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  orders: OrderItem[];
  onUpdateAppointments: (app: Appointment) => void;
  onUpdateOrders: (order: OrderItem) => void;
  onDeleteAppointment: (id: string) => void;
  onDeleteOrder: (id: string) => void;
}

export default function ScheduleManagement({ 
  appointments, 
  orders, 
  onUpdateAppointments, 
  onUpdateOrders,
  onDeleteAppointment,
  onDeleteOrder
}: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'약속' | '발주'>('약속');
  
  // Appointment Form State
  const [appDate, setAppDate] = useState('');
  const [appTime, setAppTime] = useState('');
  const [appTitle, setAppTitle] = useState('');
  const [appPerson, setAppPerson] = useState('');

  // Order Form State
  const [orderDate, setOrderDate] = useState('');
  const [orderItem, setOrderItem] = useState('');
  const [orderSpec, setOrderSpec] = useState('');
  const [orderQty, setOrderQty] = useState('');
  const [orderPartner, setOrderPartner] = useState('');

  const handleAddAppointment = () => {
    if (!appDate || !appTitle) return;
    onUpdateAppointments({
      id: Math.random().toString(36).substr(2, 9),
      siteId: '',
      date: appDate,
      time: appTime,
      title: appTitle,
      person: appPerson,
      completed: false
    });
    setAppDate(''); setAppTime(''); setAppTitle(''); setAppPerson('');
  };

  const handleAddOrder = () => {
    if (!orderDate || !orderItem) return;
    onUpdateOrders({
      id: Math.random().toString(36).substr(2, 9),
      siteId: '',
      date: orderDate,
      name: orderItem,
      spec: orderSpec,
      qty: orderQty,
      partner: orderPartner,
      status: 'ORDERED'
    });
    setOrderDate(''); setOrderItem(''); setOrderSpec(''); setOrderQty(''); setOrderPartner('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">스케줄 및 발주 관리</h2>
          <p className="text-xs text-gray-500 mt-1">현장 방문 미팅 예약과 자재 발주 현황을 통합 관리합니다.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveSubTab('약속')}
            className={`flex-1 md:flex-none px-4 py-3 md:py-1.5 text-xs font-bold rounded-md transition-all ${activeSubTab === '약속' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            미팅/약속
          </button>
          <button 
            onClick={() => setActiveSubTab('발주')}
            className={`flex-1 md:flex-none px-4 py-3 md:py-1.5 text-xs font-bold rounded-md transition-all ${activeSubTab === '발주' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            자재 발주 리스트
          </button>
        </div>
      </header>

      {activeSubTab === '약속' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-1">
            <div className="card p-4 md:p-6 space-y-4 md:sticky md:top-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Clock size={16} className="md:size-3.5" /> 신규 약속 추가
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 block">날짜 및 시간</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={appDate} onChange={e => setAppDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                    <input type="time" value={appTime} onChange={e => setAppTime(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 block">약속 내용 (미팅명)</label>
                  <input type="text" placeholder="예: 구청 인허가 미팅" value={appTitle} onChange={e => setAppTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 block">참석자 / 담당자</label>
                  <input type="text" placeholder="예: 김철수 팀장" value={appPerson} onChange={e => setAppPerson(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                </div>
                <button onClick={handleAddAppointment} className="btn-primary w-full py-4 md:py-2.5 mt-2 flex items-center justify-center gap-2 text-base md:text-xs">
                  <Plus size={18} className="md:size-4" /> 약속 추가하기
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-0 overflow-hidden shadow-md">
              <div className="bg-sidebar-dark text-white p-3 text-[11px] font-bold uppercase tracking-wider">
                예정된 미팅 및 약속 리스트
              </div>
              <div className="divide-y divide-gray-100">
                {appointments.map(app => (
                  <div key={app.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${app.completed ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center min-w-[50px] p-2 bg-gray-100 rounded-lg text-gray-500 border border-gray-200">
                        <span className="text-[10px] font-bold uppercase">{new Date(app.date).toLocaleDateString('ko-KR', { month: 'short' })}</span>
                        <span className="text-xl font-black leading-none">{new Date(app.date).getDate()}</span>
                      </div>
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                           <h4 className={`font-bold text-gray-900 text-base md:text-sm ${app.completed ? 'line-through' : ''}`}>{app.title}</h4>
                           <span className="text-[10px] font-bold text-brand-blue bg-blue-50 px-1.5 py-0.5 rounded w-fit">{app.time}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">참석: {app.person}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`p-3 md:p-2 rounded-full transition-colors ${app.completed ? 'text-green-500 bg-green-50' : 'text-gray-300 hover:text-green-500'}`}>
                        <CheckCircle2 size={24} className="md:size-4.5" />
                      </button>
                      <button onClick={() => onDeleteAppointment(app.id)} className="p-3 md:p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={22} className="md:size-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="p-20 text-center text-gray-300 text-xs italic flex flex-col items-center gap-2">
                    <Calendar size={32} className="opacity-20" />
                    예정된 약속이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-1">
             <div className="card p-4 md:p-6 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShoppingCart size={16} className="md:size-3.5" /> 신규 발주 요청
                </h3>
                <div className="space-y-3">
                   <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 block">발주 일자</label>
                      <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 block">품명</label>
                      <input type="text" placeholder="예: 시멘트" value={orderItem} onChange={e => setOrderItem(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 block">규격</label>
                          <input type="text" placeholder="예: 40kg" value={orderSpec} onChange={e => setOrderSpec(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-600 block">수량</label>
                          <input type="text" placeholder="예: 100포" value={orderQty} onChange={e => setOrderQty(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                       </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 block">발주처/업체</label>
                      <input type="text" placeholder="예: 현대시멘트" value={orderPartner} onChange={e => setOrderPartner(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-3 text-base md:text-sm focus:outline-none" />
                   </div>
                   <button onClick={handleAddOrder} className="btn-primary w-full py-4 md:py-2.5 mt-2 flex items-center justify-center gap-2 text-base md:text-xs">
                     <Plus size={18} className="md:size-4" /> 발주 리스트 추가
                   </button>
                </div>
             </div>
          </div>
          <div className="lg:col-span-3">
             <div className="card p-0 overflow-hidden shadow-md">
                {/* Desktop view Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-sidebar-dark text-white text-[11px] font-bold uppercase tracking-wider">
                          <tr>
                             <th className="px-4 py-3">일자</th>
                             <th className="px-4 py-3">품명/규격</th>
                             <th className="px-4 py-3">수량</th>
                             <th className="px-4 py-3">발주처</th>
                             <th className="px-4 py-3 text-center">상태</th>
                             <th className="px-4 py-3 text-center">삭제</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {orders.map(order => (
                            <tr key={order.id} className="hover:bg-blue-50/20 transition-colors">
                               <td className="px-4 py-3 text-xs text-gray-400 font-medium">{order.date}</td>
                               <td className="px-4 py-3">
                                  <span className="font-bold text-gray-900">{order.name}</span>
                                  <span className="text-[10px] text-gray-400 ml-2 italic">{order.spec}</span>
                               </td>
                               <td className="px-4 py-3 font-bold text-brand-blue">{order.qty}</td>
                               <td className="px-4 py-3 text-xs text-gray-600">{order.partner}</td>
                               <td className="px-4 py-3 text-center">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === 'ORDERED' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                     {order.status}
                                  </span>
                               </td>
                               <td className="px-4 py-3 text-center">
                                  <button onClick={() => onDeleteOrder(order.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                     <Trash2 size={14} />
                                  </button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                </div>

                {/* Mobile view Card List */}
                <div className="md:hidden divide-y divide-gray-100">
                    {orders.map(order => (
                      <div key={order.id} className="p-4 space-y-2 relative bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{order.date}</span>
                            <h4 className="font-bold text-gray-900 text-lg uppercase">{order.name}</h4>
                            <p className="text-xs text-gray-500">{order.spec} / {order.partner}</p>
                          </div>
                          <button onClick={() => onDeleteOrder(order.id)} className="text-gray-300 p-2">
                             <Trash2 size={20} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-brand-blue">{order.qty}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-sm ${order.status === 'ORDERED' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                {order.status}
                            </span>
                        </div>
                      </div>
                    ))}
                </div>

                {(orders.length === 0) && (
                   <div className="p-20 text-center text-gray-300 text-xs italic flex flex-col items-center gap-2">
                      <Package size={32} className="opacity-20 mb-2" />
                      입력된 발주 내역이 없습니다.
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
