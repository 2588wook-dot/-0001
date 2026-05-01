/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Photo } from '../types';
import { Camera, ImageIcon, X, Save, Edit3, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  photos: Photo[];
  onAddPhoto: (photo: Photo) => void;
  onUpdatePhoto: (photo: Photo) => void;
  onDeletePhoto: (id: string) => void;
  onSaveAndClose?: () => void;
}

export default function PhotoGalleryView({ photos, onAddPhoto, onUpdatePhoto, onDeletePhoto, onSaveAndClose }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  const handlePageSave = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      onSaveAndClose?.();
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, source: 'camera' | 'album') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: Photo = {
          id: `photo-${Date.now()}`,
          siteId: '', // To be filled by parent
          date: new Date().toISOString().split('T')[0],
          url: reader.result as string,
          title: source === 'camera' ? '현장 직찍' : '앨범 업로드',
          description: ''
        };
        onAddPhoto(newPhoto);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter italic italic">Site Photo Gallery</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">현장 상황 기록 및 사진대지 관리</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePageSave}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${showSaved ? 'bg-green-500 text-white' : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'}`}
          >
            {showSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {showSaved ? '저장됨' : '저장'}
          </button>
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 text-xs font-black rounded-xl shadow-lg shadow-brand-blue/20 active:scale-95 transition-all"
          >
            <Camera size={16} />
            촬영
          </button>
          <button 
            onClick={() => albumInputRef.current?.click()}
            className="flex items-center gap-2 bg-white border border-gray-100 text-gray-900 px-4 py-2 text-xs font-black rounded-xl shadow-sm active:scale-95 transition-all"
          >
            <ImageIcon size={16} />
            앨범
          </button>
        </div>
      </header>

      {/* Hidden Inputs */}
      <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={(e) => handleFileChange(e, 'camera')} />
      <input type="file" accept="image/*" className="hidden" ref={albumInputRef} onChange={(e) => handleFileChange(e, 'album')} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {photos.slice().reverse().map((photo) => (
            <motion.div 
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card group overflow-hidden bg-white border-none shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setEditingPhoto(photo)}
                    className="p-3 bg-white text-gray-900 rounded-full hover:bg-brand-blue hover:text-white transition-all shadow-xl"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button 
                    onClick={() => onDeletePhoto(photo.id)}
                    className="p-3 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] font-black text-white bg-black/50 px-2 py-1 rounded-full backdrop-blur-md">
                    {photo.date}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-black text-gray-900 truncate">{photo.title || '제목 없음'}</h3>
                <p className="text-[11px] text-gray-400 font-bold line-clamp-2 leading-relaxed">
                  {photo.description || '상세 내용이 없습니다.'}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {photos.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-2xl">
            <Plus size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-black uppercase tracking-widest opacity-30">No Site Photos Yet</p>
            <p className="text-[10px] mt-2 font-bold italic">우측 상단 버튼을 눌러 현장 사진을 등록하세요.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPhoto && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <div className="flex">
                <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                  <img src={editingPhoto.url} className="w-full h-full object-cover" />
                </div>
                <div className="w-1/2 p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-black italic uppercase tracking-tighter">Edit Details</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">사진 정보 수정</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Title</label>
                      <input 
                        type="text" 
                        value={editingPhoto.title || ''}
                        onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                        placeholder="사진 제목"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Description</label>
                      <textarea 
                        rows={5}
                        value={editingPhoto.description}
                        onChange={(e) => setEditingPhoto({...editingPhoto, description: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                        placeholder="상세 설명"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={() => setEditingPhoto(null)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        onUpdatePhoto(editingPhoto);
                        setEditingPhoto(null);
                      }}
                      className="flex-1 px-4 py-3 bg-brand-blue text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-brand-blue/20 transition-all active:scale-95"
                    >
                      Save Info
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
