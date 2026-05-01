/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Site } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Building2, MapPin, Calendar, HardHat, ShieldAlert } from 'lucide-react';

interface Props {
  sites: Site[];
  onSelect: (id: string) => void;
  onAddSite: (site: Site) => void;
  onDeleteSite: (id: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
}

export default function SiteSelector({ sites, onSelect, onAddSite, onDeleteSite, isAdminMode, setIsAdminMode }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSite, setNewSite] = useState<Partial<Site>>({});
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const verifyPassword = () => {
    if (password === '7777') {
      setIsAdminMode(true);
      setShowPasswordPrompt(false);
      setPassword('');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleAdd = () => {
    if (!newSite.name) return;
    const site: Site = {
      id: `site-${Date.now()}`,
      name: newSite.name || '',
      client: newSite.client || '',
      contractor: newSite.contractor || '',
      address: newSite.address || '',
      startDate: newSite.startDate || '',
      endDate: newSite.endDate || '',
      contractAmount: Number(newSite.contractAmount) || 0,
      manager: newSite.manager || '',
      supervisor: newSite.supervisor || '',
      partners: [],
      notes: newSite.notes || ''
    };
    onAddSite(site);
    setIsAdding(false);
    setNewSite({});
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-b border-[#141414] pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">ArchiLog</h1>
            <p className="font-mono text-[10px] tracking-widest opacity-60">CONSTRUCTION SITE MANAGEMENT SYSTEM v1.0</p>
          </div>
          <div className="flex flex-col items-end gap-3 font-mono">
            <button 
              onClick={handleAdminToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tighter uppercase transition-all ${isAdminMode ? 'bg-brand-orange text-white' : 'bg-[#141414]/5 text-[#141414]/60 hover:bg-[#141414]/10'}`}
            >
              <ShieldAlert size={12} />
              {isAdminMode ? 'ADMIN ACTIVE' : 'LOCKED'}
            </button>
            <div className="text-right text-[10px] opacity-40">
              {new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>
        </header>

        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-black italic serif underline-offset-8 decoration-2 underline">현장 선택 [SITE SELECTION]</h2>
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#141414] text-[#E4E3E0] px-6 py-4 md:py-2.5 text-sm font-black tracking-tight hover:shadow-xl active:scale-95 transition-all"
            >
              <Plus size={18} /> 현장 추가 [NEW SITE]
            </button>
          </div>

          <div className="space-y-4">
            {sites.map((site, index) => (
              <div 
                key={site.id}
                onClick={() => onSelect(site.id)}
                className="group relative bg-white border-2 border-[#141414] p-4 md:p-6 hover:translate-x-2 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#141414] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-mono text-[10px] opacity-40">#{(index + 1).toString().padStart(2, '0')}</span>
                    <h3 className="text-xl font-black truncate">{site.name}</h3>
                    {isAdminMode && (
                      <span className="bg-brand-orange/10 text-brand-orange text-[9px] font-bold px-1.5 py-0.5 rounded tracking-tighter">EDITABLE</span>
                    )}
                  </div>
                  
                  {/* Horizontal Alignment: Name, Address, Notes */}
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 overflow-hidden">
                    <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0">
                      <MapPin size={14} className="shrink-0 text-brand-blue" />
                      <span className="truncate">{site.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-blue font-bold min-w-0">
                      <Building2 size={14} className="shrink-0" />
                      <span className="truncate">{site.notes || '현장 정보가 등록되지 않았습니다.'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <Calendar size={12} className="shrink-0" />
                      <span>{site.startDate} ~ {site.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t border-gray-100 md:border-none pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">Manager</p>
                    <p className="text-sm font-bold text-gray-900">{site.manager}</p>
                  </div>
                  
                  {isAdminMode && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('정말로 현장 정보를 삭제하시겠습니까? 데이터는 복구할 수 없습니다.')) onDeleteSite(site.id);
                      }}
                      className="p-3 text-red-100 bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-lg shadow-red-500/20"
                      title="현장 삭제"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {sites.length === 0 && (
              <div className="p-20 text-center border-4 border-dashed border-[#141414]/10 rounded-2xl opacity-20 flex flex-col items-center gap-4">
                <HardHat size={48} />
                <p className="font-black text-sm uppercase tracking-widest italic">등록된 현장이 없습니다. [NO SITES REGISTERED]</p>
              </div>
            )}
          </div>
        </section>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <div className="bg-[#E4E3E0] border-4 border-[#141414] w-full max-w-2xl p-8 shadow-[16px_16px_0px_#141414]">
                <div className="flex justify-between items-center mb-8 border-b-2 border-[#141414] pb-4">
                  <h3 className="text-2xl font-black italic serif uppercase tracking-tight">현장 등록 [SITE REGISTRATION]</h3>
                  <button onClick={() => setIsAdding(false)} className="hover:rotate-90 transition-transform p-1">
                    <Plus className="rotate-45" size={32} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block font-black text-[10px] uppercase text-gray-400 group-focus-within:text-brand-blue tracking-widest mb-1">현장명 [Site Name]</label>
                      <input 
                        type="text" 
                        placeholder="예: 강남 테헤란로 빌딩"
                        value={newSite.name || ''}
                        onChange={e => setNewSite({...newSite, name: e.target.value})}
                        className="w-full bg-transparent border-b-2 border-[#141414] px-1 py-2 focus:outline-none focus:border-brand-blue font-bold text-lg" 
                      />
                    </div>
                    <div className="group">
                      <label className="block font-black text-[10px] uppercase text-gray-400 group-focus-within:text-brand-blue tracking-widest mb-1">발주처 [Client]</label>
                      <input 
                        type="text"
                        placeholder="주식회사 에이비씨"
                        value={newSite.client || ''}
                        onChange={e => setNewSite({...newSite, client: e.target.value})}
                        className="w-full bg-transparent border-b-2 border-[#141414] px-1 py-1 focus:outline-none focus:border-brand-blue font-medium" 
                      />
                    </div>
                    <div className="group">
                      <label className="block font-black text-[10px] uppercase text-gray-400 group-focus-within:text-brand-blue tracking-widest mb-1">현장주소 [Address]</label>
                      <input 
                        type="text"
                        placeholder="서울특별시 강남구..."
                        value={newSite.address || ''}
                        onChange={e => setNewSite({...newSite, address: e.target.value})}
                        className="w-full bg-transparent border-b-2 border-[#141414] px-1 py-1 focus:outline-none focus:border-brand-blue font-medium" 
                      />
                    </div>
                    <div className="group">
                      <label className="block font-black text-[10px] uppercase text-gray-400 group-focus-within:text-brand-blue tracking-widest mb-1">현장 제목/제목 [Notes]</label>
                      <input 
                        type="text"
                        placeholder="지하 2층 지상 10층 근생시설 공사"
                        value={newSite.notes || ''}
                        onChange={e => setNewSite({...newSite, notes: e.target.value})}
                        className="w-full bg-transparent border-b-2 border-[#141414] px-1 py-1 focus:outline-none focus:border-brand-blue font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest mb-1">착공일</label>
                        <input 
                          type="date"
                          value={newSite.startDate || ''}
                          onChange={e => setNewSite({...newSite, startDate: e.target.value})}
                          className="w-full bg-transparent border-b-2 border-[#141414] px-1 py-1 focus:outline-none font-mono text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest mb-1">준공예정일</label>
                        <input 
                          type="date"
                          value={newSite.endDate || ''}
                          onChange={e => setNewSite({...newSite, endDate: e.target.value})}
                          className="w-full bg-transparent border-b-2 border-[#141414] px-1 py-1 focus:outline-none font-mono text-sm" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-black text-[10px] uppercase text-gray-400 group-focus-within:text-brand-blue tracking-widest mb-1">계약금액 [Contract Amount]</label>
                      <input 
                        type="number"
                        placeholder="0"
                        value={newSite.contractAmount || ''}
                        onChange={e => setNewSite({...newSite, contractAmount: Number(e.target.value)})}
                        className="w-full bg-transparent border-b-2 border-[#141414] px-1 py-1 focus:outline-none focus:border-brand-blue font-bold font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block font-black text-[10px] uppercase text-gray-400 group-focus-within:text-brand-blue tracking-widest mb-1">현장소장 [Manager]</label>
                      <input 
                        type="text"
                        placeholder="이름 입력"
                        value={newSite.manager || ''}
                        onChange={e => setNewSite({...newSite, manager: e.target.value})}
                        className="w-full bg-transparent border-b-2 border-[#141414] px-1 py-1 focus:outline-none focus:border-brand-blue font-bold" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-end gap-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="w-full md:w-auto px-10 py-4 md:py-2 bg-transparent border-2 border-[#141414] text-[#141414] font-black text-sm uppercase hover:bg-[#141414] hover:text-[#E4E3E0] transition-all"
                  >
                    취소 [CANCEL]
                  </button>
                  <button 
                    onClick={handleAdd}
                    className="w-full md:w-auto px-10 py-4 md:py-2 bg-[#141414] text-[#E4E3E0] font-black text-sm uppercase hover:shadow-[4px_4px_0px_#8b8a87] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    등록 [SUBMIT]
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password Prompt modal */}
        <AnimatePresence>
          {showPasswordPrompt && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-sidebar-dark/95 flex items-center justify-center p-4 z-[100] backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white border-4 border-brand-orange p-8 w-full max-w-sm shadow-[12px_12px_0px_#EF4444]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert size={32} className="text-brand-orange" />
                  <h3 className="text-2xl font-black italic tracking-tighter">ADMIN AUTH</h3>
                </div>
                <p className="text-sm text-gray-500 font-bold mb-6 tracking-tight">현장 관리 권한 획득을 위해 비밀번호를 입력하십시오.</p>
                <input 
                  type="password"
                  placeholder="CODE"
                  value={password}
                  onChange={p => setPassword(p.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verifyPassword()}
                  className="w-full bg-gray-50 border-2 border-border-gray rounded px-4 py-4 text-2xl font-black tracking-[1em] focus:outline-none focus:border-brand-orange text-center mb-6"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowPasswordPrompt(false)}
                    className="flex-1 px-4 py-4 bg-gray-100 text-gray-700 rounded font-black text-xs uppercase"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={verifyPassword}
                    className="flex-1 px-4 py-4 bg-brand-orange text-white rounded font-black text-xs uppercase shadow-lg shadow-brand-orange/20"
                  >
                    VERIFY
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-24 border-t border-[#141414] pt-6 text-[10px] font-black font-mono opacity-20 flex justify-between tracking-widest">
          <div>&copy; 2024 ARCHILOG MANAGEMENT SYSTEM</div>
          <div>ESTABLISHED CONNECTION: SECURE</div>
        </footer>
      </div>
    </div>
  );
}
