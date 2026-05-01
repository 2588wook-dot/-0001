/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Blueprint } from '../types';
import { FileText, Plus, Search, Filter, Trash2, Download, Eye, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  blueprints: Blueprint[];
  onUpdate: (blueprint: Blueprint) => void;
  onDelete: (id: string) => void;
  onSaveAndClose?: () => void;
}

export default function BlueprintsView({ blueprints, onUpdate, onDelete, onSaveAndClose }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showSaved, setShowSaved] = useState(false);

  const handlePageSave = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      onSaveAndClose?.();
    }, 1000);
  };

  const categories = ['전체', '평면도', '구조도', '설비도', '인테리어', '기타'];

  const filtered = blueprints.filter(b => 
    (selectedCategory === '전체' || b.category === selectedCategory) &&
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('도면을 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const handleUpload = () => {
    // Simulated upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const newBlueprint: Blueprint = {
          id: Math.random().toString(36).substr(2, 9),
          siteId: '', // Will be set in App.tsx
          name: file.name.split('.')[0],
          url: URL.createObjectURL(file),
          uploadDate: new Date().toISOString().split('T')[0],
          category: '기타'
        };
        onUpdate(newBlueprint);
      }
    };
    input.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20 md:pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex justify-between w-full md:w-auto items-center">
          <div>
            <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">현장 도면 및 PDF 관리</h2>
            <p className="text-xs text-gray-500 mt-1">현장의 최신 도면을 관리하고 어디서나 열람할 수 있습니다.</p>
          </div>
          <button 
            onClick={handlePageSave}
            className={`md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${showSaved ? 'bg-green-500 text-white' : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'}`}
          >
            {showSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {showSaved ? '저장됨' : '저장'}
          </button>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleUpload}
            className="btn-primary flex-1 md:flex-none px-6 py-4 md:py-2.5 flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20"
          >
            <Plus size={18} /> 도면 업로드
          </button>
          <button 
            onClick={handlePageSave}
            className={`hidden md:flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${showSaved ? 'bg-green-500 text-white' : 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 hover:scale-105 active:scale-95'}`}
          >
            {showSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {showSaved ? '도면 목록 저장됨' : '목록 저장'}
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="도면명 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-3 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <Filter size={16} className="text-gray-400 shrink-0 hidden md:block" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-brand-blue text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(b => (
            <motion.div 
              layout
              key={b.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-50 group-hover:bg-brand-blue transition-colors rounded-bl-3xl flex items-center justify-center">
                <FileText size={20} className="text-brand-blue group-hover:text-white transition-colors" />
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-black text-brand-blue bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">{b.category}</span>
                <h3 className="text-sm font-black text-gray-900 mt-2 truncate pr-6" title={b.name}>{b.name}</h3>
                <p className="text-[10px] text-gray-400 font-mono mt-1">UPLOADED: {b.uploadDate}</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => window.open(b.url, '_blank')}
                  className="flex-1 bg-gray-50 hover:bg-brand-blue hover:text-white text-brand-blue font-black text-[11px] py-2 rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <Eye size={14} /> 보기
                </button>
                <button 
                  className="w-10 h-9 bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg transition-all flex items-center justify-center"
                >
                  <Download size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(b.id)}
                  className="w-10 h-9 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full py-32 text-center flex flex-col items-center gap-4 opacity-30">
            <div className="bg-gray-100 p-8 rounded-full">
              <FileText size={48} />
            </div>
            <p className="text-sm font-black uppercase tracking-widest">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
