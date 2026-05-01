/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Site, WorkLog, PersonnelLog, EquipmentLog, MaterialLog, Photo, AdminFinance, WeeklySchedule, Appointment, OrderItem, ProjectMemo, ProductivityLog } from './types';
import { INITIAL_SITES } from './constants';
import { loadFromStorage, saveToStorage } from './lib/storage';
import SiteSelector from './components/SiteSelector';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import ExitModal from './components/ExitModal';

export default function App() {
  const [sites, setSites] = useState<Site[]>(() => loadFromStorage('sites', INITIAL_SITES));
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(() => loadFromStorage('selectedSiteId', null));
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTab, setActiveTab] = useState('대시보드');
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Site data states
  const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => loadFromStorage('workLogs', []));
  const [personnelLogs, setPersonnelLogs] = useState<PersonnelLog[]>(() => loadFromStorage('personnelLogs', []));
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>(() => loadFromStorage('equipmentLogs', []));
  const [materialLogs, setMaterialLogs] = useState<MaterialLog[]>(() => loadFromStorage('materialLogs', []));
  const [photos, setPhotos] = useState<Photo[]>(() => loadFromStorage('photos', []));
  const [finances, setFinances] = useState<AdminFinance[]>(() => loadFromStorage('finances', []));
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedule[]>(() => loadFromStorage('weeklySchedules', []));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadFromStorage('appointments', []));
  const [orders, setOrders] = useState<OrderItem[]>(() => loadFromStorage('orders', []));
  const [memos, setMemos] = useState<ProjectMemo[]>(() => loadFromStorage('memos', []));
  const [productivityLogs, setProductivityLogs] = useState<ProductivityLog[]>(() => loadFromStorage('productivityLogs', []));
  const [blueprints, setBlueprints] = useState<Blueprint[]>(() => loadFromStorage('blueprints', []));

  useEffect(() => {
    saveToStorage('sites', sites);
    saveToStorage('selectedSiteId', selectedSiteId);
    saveToStorage('workLogs', workLogs);
    saveToStorage('personnelLogs', personnelLogs);
    saveToStorage('equipmentLogs', equipmentLogs);
    saveToStorage('materialLogs', materialLogs);
    saveToStorage('photos', photos);
    saveToStorage('finances', finances);
    saveToStorage('weeklySchedules', weeklySchedules);
    saveToStorage('appointments', appointments);
    saveToStorage('orders', orders);
    saveToStorage('memos', memos);
    saveToStorage('productivityLogs', productivityLogs);
    saveToStorage('blueprints', blueprints);
  }, [sites, selectedSiteId, workLogs, personnelLogs, equipmentLogs, materialLogs, photos, finances, weeklySchedules, appointments, orders, memos, productivityLogs, blueprints]);

  const selectedSite = sites.find(s => s.id === selectedSiteId);

  if (!selectedSiteId || !selectedSite) {
    return (
      <SiteSelector 
        sites={sites} 
        onSelect={(id) => setSelectedSiteId(id)} 
        onAddSite={(newSite) => setSites(prev => [...prev, newSite])}
        onDeleteSite={(id) => setSites(prev => prev.filter(s => s.id !== id))}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />
    );
  }

  return (
    <MainLayout 
      site={selectedSite} 
      onLogout={() => setSelectedSiteId(null)}
      isAdminMode={isAdminMode}
      setIsAdminMode={setIsAdminMode}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onExit={() => setShowExitModal(true)}
      onSave={() => {
        setIsSaving(true);
        saveToStorage('sites', sites);
        saveToStorage('workLogs', workLogs);
        saveToStorage('personnelLogs', personnelLogs);
        saveToStorage('equipmentLogs', equipmentLogs);
        saveToStorage('materialLogs', materialLogs);
        saveToStorage('photos', photos);
        saveToStorage('finances', finances);
        saveToStorage('weeklySchedules', weeklySchedules);
        saveToStorage('memos', memos);
        
        setTimeout(() => {
          setIsSaving(false);
        }, 2000);
      }}
    >
      <Dashboard 
        site={selectedSite}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logs={{
          work: workLogs.filter(l => l.siteId === selectedSiteId),
          personnel: personnelLogs.filter(l => l.siteId === selectedSiteId),
          equipment: equipmentLogs.filter(l => l.siteId === selectedSiteId),
          material: materialLogs.filter(l => l.siteId === selectedSiteId),
          photos: photos.filter(l => l.siteId === selectedSiteId),
          finance: finances.find(f => f.siteId === selectedSiteId),
          weeklySchedules: weeklySchedules.filter(l => l.siteId === selectedSiteId),
          appointments: appointments.filter(l => l.siteId === selectedSiteId),
          memos: memos.filter(l => l.siteId === selectedSiteId),
          orders: orders.filter(l => l.siteId === selectedSiteId),
          productivity: productivityLogs.filter(l => l.siteId === selectedSiteId),
          blueprints: blueprints.filter(l => l.siteId === selectedSiteId)
        }}
        onUpdateWorkLog={(log) => setWorkLogs(prev => {
          const idx = prev.findIndex(p => p.id === log.id && p.siteId === log.siteId);
          if (idx > -1) return prev.map((p, i) => i === idx ? log : p);
          return [...prev, log];
        })}
        onUpdatePersonnel={(log) => setPersonnelLogs(prev => {
          const idx = prev.findIndex(p => p.id === log.id);
          if (idx > -1) return prev.map((p, i) => i === idx ? log : p);
          return [...prev, log];
        })}
        onUpdateEquipment={(log) => setEquipmentLogs(prev => {
          const idx = prev.findIndex(p => p.id === log.id);
          if (idx > -1) return prev.map((p, i) => i === idx ? log : p);
          return [...prev, log];
        })}
        onUpdateMaterial={(log) => setMaterialLogs(prev => {
          const idx = prev.findIndex(p => p.id === log.id);
          if (idx > -1) return prev.map((p, i) => i === idx ? log : p);
          return [...prev, log];
        })}
        onDeletePersonnel={(id) => setPersonnelLogs(prev => prev.filter(l => l.id !== id))}
        onDeleteEquipment={(id) => setEquipmentLogs(prev => prev.filter(l => l.id !== id))}
        onDeleteMaterial={(id) => setMaterialLogs(prev => prev.filter(l => l.id !== id))}
        onUpdateFinance={(fin) => setFinances(prev => {
          const idx = prev.findIndex(f => f.siteId === fin.siteId);
          if (idx > -1) return prev.map((f, i) => i === idx ? fin : f);
          return [...prev, fin];
        })}
        onUpdatePhotos={(photo) => setPhotos(prev => [...prev, {...photo, siteId: selectedSiteId!}])}
        onUpdatePhotoDetails={(photo) => setPhotos(prev => prev.map(p => p.id === photo.id ? photo : p))}
        onDeletePhoto={(id) => setPhotos(prev => prev.filter(p => p.id !== id))}
        onUpdateProductivity={(log) => setProductivityLogs(prev => {
          const idx = prev.findIndex(p => p.id === log.id);
          if (idx > -1) return prev.map((p, i) => i === idx ? log : p);
          return [...prev, {...log, siteId: selectedSiteId!}];
        })}
        onDeleteProductivity={(id) => setProductivityLogs(prev => prev.filter(l => l.id !== id))}
        onUpdateWeeklySchedule={(log) => setWeeklySchedules(prev => {
          const idx = prev.findIndex(p => p.id === log.id);
          if (idx > -1) return prev.map((p, i) => i === idx ? log : p);
          return [...prev, {...log, siteId: selectedSiteId!}];
        })}
        onDeleteWeeklySchedule={(id) => setWeeklySchedules(prev => prev.filter(l => l.id !== id))}
        onUpdateMemo={(memo) => setMemos(prev => {
          const idx = prev.findIndex(m => m.id === memo.id);
          if (idx > -1) return prev.map((m, i) => i === idx ? memo : m);
          return [...prev, {...memo, siteId: selectedSiteId!}];
        })}
        onDeleteMemo={(id) => setMemos(prev => prev.filter(m => m.id !== id))}
        onUpdateAppointment={(app) => setAppointments(prev => {
          const idx = prev.findIndex(a => a.id === app.id);
          if (idx > -1) return prev.map((a, i) => i === idx ? app : a);
          return [...prev, {...app, siteId: selectedSiteId!}];
        })}
        onDeleteAppointment={(id) => setAppointments(prev => prev.filter(l => l.id !== id))}
        onUpdateOrder={(order) => setOrders(prev => {
          const idx = prev.findIndex(o => o.id === order.id);
          if (idx > -1) return prev.map((o, i) => i === idx ? order : o);
          return [...prev, {...order, siteId: selectedSiteId!}];
        })}
        onDeleteOrder={(id) => setOrders(prev => prev.filter(l => l.id !== id))}
        onUpdateBlueprints={(blueprint) => setBlueprints(prev => {
          const idx = prev.findIndex(p => p.id === blueprint.id);
          if (idx > -1) return prev.map((p, i) => i === idx ? blueprint : p);
          return [...prev, {...blueprint, siteId: selectedSiteId!}];
        })}
        onDeleteBlueprint={(id) => setBlueprints(prev => prev.filter(b => b.id !== id))}
        isAdminMode={isAdminMode}
      />
      {showExitModal && (
        <ExitModal 
          onConfirm={() => {
            setShowExitModal(false);
            setSelectedSiteId(null);
            setActiveTab('대시보드');
          }}
          onCancel={() => setShowExitModal(false)}
        />
      )}

      {isSaving && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
          <div className="bg-brand-blue text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            현장 데이터 동기화 완료
          </div>
        </div>
      )}
    </MainLayout>
  );
}

