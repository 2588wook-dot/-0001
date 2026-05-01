/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { LogOut, AlertCircle, Building2 } from 'lucide-react';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white max-w-sm w-full border-4 border-brand-blue shadow-[12px_12px_0px_#141414] p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="bg-brand-blue text-white p-4 rounded-2xl">
              <Building2 size={32} />
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full border-2 border-white">
              <AlertCircle size={14} />
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">ArchiLog</h3>
        <p className="text-sm font-bold text-gray-500 mb-8 leading-relaxed">
          현업을 종료하고 현장 선택 화면으로<br />이동하시겠습니까?
        </p>

        <div className="space-y-3">
          <button 
            onClick={onConfirm}
            className="w-full py-4 bg-brand-blue text-white rounded-xl text-xs font-black shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <LogOut size={16} /> 네, 나가겠습니다
          </button>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-gray-50 text-gray-500 rounded-xl text-xs font-black hover:bg-gray-100 transition-all"
          >
            취소하고 계속 작업하기
          </button>
        </div>
        
        <p className="mt-6 text-[9px] font-black text-gray-300 uppercase tracking-widest">
          Always Professional • ArchiLog System
        </p>
      </motion.div>
    </div>
  );
}
