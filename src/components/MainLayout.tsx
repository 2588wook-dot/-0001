/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode, useEffect } from 'react';
import { Site } from '../types';
import { 
  Building2, 
  ClipboardList, 
  Image, 
  Users, 
  Truck, 
  Package, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldAlert,
  Menu,
  X,
  CreditCard,
  Calculator,
  FileText,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  site: Site;
  children: ReactNode;
  onLogout: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  onExit?: () => void;
  onSave?: () => void;
}

export default function MainLayout({ site, children, onLogout, isAdminMode, setIsAdminMode, activeTab, setActiveTab, onExit, onSave }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setActiveTab('대시보드');
    } else {
      setShowPasswordPrompt(true);
    }
  };

  const verifyPassword = () => {
    if (password === '7777') {
      setIsAdminMode(true);
      setShowPasswordPrompt(false);
      setPassword('');
      setActiveTab('업체 결재액 관리');
      setIsSidebarOpen(false);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const menuItems = [
    { icon: Building2, label: '대시보드', admin: false },
    { icon: ClipboardList, label: '공사일보 작성', admin: false },
    { icon: Image, label: '사진대지 관리', admin: false },
    { icon: Users, label: '인원 투입', admin: false },
    { icon: Truck, label: '장비 투입', admin: false },
    { icon: Package, label: '자재 반입·반출', admin: false },
    { icon: Calendar, label: '스케줄 관리', admin: false },
    { icon: BarChart3, label: '일반 공정표', admin: false },
    { icon: FileText, label: '현장 도면 [PDF]', admin: false },
    { icon: FileText, label: '보고서 출력', admin: false },
  ];

  const adminMenuItems = [
    { icon: CreditCard, label: '업체 결재액 관리' },
    { icon: Calculator, label: '공사비 관리' },
    { icon: ShieldAlert, label: '실행금액 관리' },
    { icon: Users, label: '노무비 단가 관리' },
    { icon: Settings, label: '현장설정' },
  ];

  const mobileNavItems = [
    { icon: Building2, label: '대시보드' },
    { icon: ClipboardList, label: '일보작성' },
    { icon: FileText, label: '도면관리' },
    { icon: Save, label: '저장', isAction: true },
    { icon: LogOut, label: '나가기', isAction: true, danger: true },
    { icon: ShieldAlert, label: '관리자', special: true },
  ];

  const handleAction = (label: string) => {
    if (label === '저장') {
      if (onSave) onSave();
      else alert('데이터가 성공적으로 저장되었습니다.');
    } else if (label === '나가기') {
      if (onExit) onExit();
      else if (confirm('현장을 나가시겠습니까?')) onLogout();
    }
  };

  const isMobile = windowWidth < 768;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-bg-gray font-sans overflow-hidden">
      {/* Desktop Sidebar / Mobile Overlay Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside 
            initial={{ x: -240 }}
            animate={{ x: 0, width: isSidebarOpen ? 240 : (isMobile ? 0 : 70) }}
            exit={{ x: -240 }}
            className={`fixed md:relative bg-sidebar-dark text-white flex flex-col h-full shrink-0 overflow-hidden z-[60] transition-all shadow-xl`}
            style={{ 
              display: !isSidebarOpen && isMobile ? 'none' : 'flex' 
            }}
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-xl">🏗️</span>
                {isSidebarOpen && <span className="text-lg font-extrabold tracking-tight whitespace-nowrap">Smart Daily</span>}
              </div>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

            <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="space-y-1">
                {isSidebarOpen && <p className="text-[11px] font-bold uppercase text-white/40 px-3 mb-2 tracking-wider">일반 업무</p>}
                {menuItems.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => {
                      setActiveTab(item.label);
                      if (typeof window !== 'undefined' && window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`w-full nav-item group relative ${activeTab === item.label ? 'bg-brand-blue font-semibold' : 'hover:bg-white/5 text-white/70'}`}
                  >
                    <item.icon size={18} className={`shrink-0 ${activeTab === item.label ? 'text-white' : 'group-hover:text-white'}`} />
                    {isSidebarOpen && <span className="whitespace-nowrap text-sm">{item.label}</span>}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-3 mb-2">
                  {isSidebarOpen && <p className="text-[11px] font-bold uppercase text-white/40 tracking-wider">ADMIN MODE</p>}
                </div>

                {isAdminMode ? (
                  <div className="space-y-1">
                    {adminMenuItems.map((item, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          setActiveTab(item.label);
                          if (typeof window !== 'undefined' && window.innerWidth < 768) setIsSidebarOpen(false);
                        }}
                        className={`nav-item w-full group relative ${activeTab === item.label ? 'bg-brand-orange font-semibold' : 'hover:bg-white/5 text-brand-orange'}`}
                      >
                        <item.icon size={18} className="shrink-0" />
                        {isSidebarOpen && <span className="whitespace-nowrap text-sm">{item.label}</span>}
                      </button>
                    ))}
                    <button 
                      onClick={handleAdminToggle}
                      className="w-full flex items-center justify-center gap-2 mt-4 py-2 border border-brand-orange/30 rounded-md text-[11px] text-brand-orange hover:bg-brand-orange/10 transition-colors"
                    >
                      <ShieldAlert size={12} />
                      {isSidebarOpen && <span>관리자 모드 해제</span>}
                    </button>
                  </div>
                ) : (
                  isSidebarOpen && (
                    <div 
                      onClick={handleAdminToggle}
                      className="mx-2 p-3 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange rounded-lg text-center text-xs font-semibold cursor-pointer hover:bg-brand-orange/20 transition-all font-sans uppercase tracking-tight"
                    >
                      🔒 관리자 모드 진입
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="p-4 border-t border-white/5">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/40 hover:text-white hover:bg-white/5 rounded-md transition-all"
              >
                <LogOut size={16} />
                {isSidebarOpen && <span className="whitespace-nowrap">현장 전환 [EXIT]</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay Background */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pb-16 md:pb-0">
        <header className="bg-white border-b border-border-gray px-4 md:px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 -ml-2 text-gray-700 bg-gray-50 rounded-xl transition-colors active:bg-gray-100"
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-base md:text-xl font-black tracking-tight truncate leading-tight text-gray-900">
                {site.name} 
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">CONSTRUCTION LIVE</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] text-gray-400 font-medium">{new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</p>
              <p className="text-xs font-bold">맑음 (18.5°C)</p>
            </div>
            <button 
              className="btn-primary py-2.5 px-4 text-xs font-black shadow-lg shadow-brand-blue/30 active:scale-95 transition-transform" 
              onClick={() => setActiveTab('공사일보 작성')}
            >
              <span className="md:hidden">+ 작성</span>
              <span className="hidden md:inline">+ 공사일보 작성</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 h-full">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-18 bg-white border-t border-gray-100 flex items-center justify-around px-1 z-40 md:hidden pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item, idx) => {
          const isActive = !item.isAction && (activeTab === item.label || (item.label === '일보작성' && activeTab === '공사일보 작성') || (item.label === '도면관리' && activeTab === '현장 도면 [PDF]') || (item.special && isAdminMode));
          
          return (
            <button 
              key={idx}
              onClick={() => {
                if (item.isAction) {
                  handleAction(item.label);
                } else if (item.special) {
                  if (isAdminMode) setActiveTab('업체 결재액 관리');
                  else handleAdminToggle();
                } else {
                  const targetLabel = item.label === '일보작성' ? '공사일보 작성' : (item.label === '도면관리' ? '현장 도면 [PDF]' : item.label);
                  setActiveTab(targetLabel);
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all relative ${
                isActive ? 'text-brand-blue' : 'text-gray-400'
              } ${item.danger ? 'text-red-500' : ''}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute top-0 w-8 h-1 bg-brand-blue rounded-b-full"
                />
              )}
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`${item.special && isAdminMode ? 'text-brand-orange' : ''} ${item.label === '나가기' ? 'opacity-70' : ''}`} />
              <span className={`text-[9px] ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Password Prompt modal */}
      <AnimatePresence>
        {showPasswordPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-sidebar-dark/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white border border-border-gray rounded-xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-orange/10 p-3 rounded-full text-brand-orange">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="text-xl font-bold">관리자 인증</h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">현장 주요 데이터 관리를 위해 비밀번호를 입력해주세요. (Pass: 7777)</p>
              <input 
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={p => setPassword(p.target.value)}
                onKeyDown={e => e.key === 'Enter' && verifyPassword()}
                className="w-full bg-gray-50 border border-border-gray rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all mb-6"
                autoFocus
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPasswordPrompt(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
                >
                  취소
                </button>
                <button 
                  onClick={verifyPassword}
                  className="flex-1 px-4 py-3 bg-brand-orange text-white rounded-lg font-bold shadow-lg shadow-brand-orange/20 hover:bg-orange-600 transition-all"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
