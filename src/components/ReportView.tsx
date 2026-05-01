/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Site, WorkLog, PersonnelLog, EquipmentLog, MaterialLog } from '../types';
import { Printer, Download, FileText } from 'lucide-react';

interface Props {
  site: Site;
  logs: {
    work: WorkLog[];
    personnel: PersonnelLog[];
    equipment: EquipmentLog[];
    material: MaterialLog[];
  };
}

export default function ReportView({ site, logs }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const todayWork = logs.work.find(l => l.date === today) || logs.work[logs.work.length - 1];
  const todayPersonnel = logs.personnel.filter(l => l.date === (todayWork?.date || today));
  const todayEquipment = logs.equipment.filter(l => l.date === (todayWork?.date || today));
  const todayMaterial = logs.material.filter(l => l.date === (todayWork?.date || today));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText size={20} className="text-brand-blue" />
          공사일보 출력 (A4)
        </h2>
        <div className="flex gap-2">
          <button className="btn-primary flex items-center gap-2" onClick={handlePrint}>
            <Printer size={16} /> 인쇄하기
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} /> PDF 저장
          </button>
        </div>
      </div>

      {/* A4 Report Page */}
      <div className="bg-white mx-auto shadow-2xl p-[20mm] w-[210mm] min-h-[297mm] font-serif border border-gray-200 print:shadow-none print:p-0 print:border-none print:w-full print:m-0" id="a4-report">
        <div className="border-[1.5pt] border-black p-1">
          <div className="border border-black">
            <header className="flex border-b border-black">
              <div className="flex-1 p-6 border-r border-black flex flex-col justify-center items-center">
                <h1 className="text-2xl font-black underline underline-offset-8">공 사 일 보</h1>
                <p className="text-xs mt-2 uppercase tracking-widest font-sans font-bold opacity-70">Daily Construction Report</p>
              </div>
              <div className="w-64 flex divide-x divide-black">
                <div className="flex-1 flex flex-col">
                  <div className="h-1/4 border-b border-black text-[8pt] text-center bg-gray-50 flex items-center justify-center font-sans font-bold">결 재</div>
                  <div className="flex-1 flex divide-x divide-black">
                    <div className="flex-1 flex flex-col">
                      <div className="h-4 border-b border-black text-[7pt] text-center bg-gray-50 font-sans">담당</div>
                      <div className="flex-1"></div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="h-4 border-b border-black text-[7pt] text-center bg-gray-50 font-sans">팀장</div>
                      <div className="flex-1"></div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="h-4 border-b border-black text-[7pt] text-center bg-gray-50 font-sans">소장</div>
                      <div className="flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="p-4 grid grid-cols-2 gap-4 border-b border-black bg-gray-50/30 font-sans">
              <div className="space-y-1">
                <p className="text-xs"><span className="font-bold w-16 inline-block">공 사 명 :</span> {site.name}</p>
                <p className="text-xs"><span className="font-bold w-16 inline-block">일 자 :</span> {todayWork?.date || today} ({new Date(todayWork?.date || today).toLocaleDateString('ko-KR', { weekday: 'long' })})</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs"><span className="font-bold w-16 inline-block">날 씨 :</span> {todayWork?.weather || '맑음'}</p>
                <p className="text-xs"><span className="font-bold w-16 inline-block">작성자 :</span> {site.manager}</p>
              </div>
            </div>

            <section className="border-b border-black p-4 font-sans">
              <h3 className="text-sm font-bold mb-3 border-l-4 border-black pl-2">1. 금일 작업 현황</h3>
              <div className="w-full bg-blue-50/50 p-4 rounded text-sm min-h-[150px] leading-relaxed whitespace-pre-wrap">
                {todayWork?.todayWork || '입력된 작업 내용이 없습니다.'}
              </div>
            </section>

            <section className="border-b border-black p-4 font-sans">
              <h3 className="text-sm font-bold mb-3 border-l-4 border-black pl-2">2. 명일 작업 계획</h3>
              <div className="w-full bg-orange-50/50 p-4 rounded text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {todayWork?.tomorrowWork || '입력된 작업 계획이 없습니다.'}
              </div>
            </section>

            <div className="grid grid-cols-2 divide-x divide-black font-sans">
              <section className="p-4 flex flex-col">
                <h3 className="text-sm font-bold mb-3 border-l-4 border-black pl-2">3. 인원 투입 (누계)</h3>
                <table className="w-full border-collapse border border-black text-[9pt]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black p-1">업체명</th>
                      <th className="border border-black p-1">공종</th>
                      <th className="border border-black p-1">인원</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayPersonnel.map((p, i) => (
                      <tr key={i}>
                        <td className="border border-black p-1">{p.partnerName}</td>
                        <td className="border border-black p-1">{p.trade}</td>
                        <td className="border border-black p-1 text-right">{p.count}</td>
                      </tr>
                    ))}
                    {todayPersonnel.length === 0 && (
                      <tr><td colSpan={3} className="border border-black p-4 text-center italic text-gray-400">데이터 없음</td></tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td colSpan={2} className="border border-black p-1 text-center">합 계</td>
                      <td className="border border-black p-1 text-right">{todayPersonnel.reduce((acc, curr) => acc + curr.count, 0)}</td>
                    </tr>
                  </tfoot>
                </table>
                <p className="text-[8pt] text-right mt-2 text-gray-500 italic">※ 누계 인원: {logs.personnel.reduce((acc, curr) => acc + curr.count, 0)}명</p>
              </section>

              <section className="p-4 flex flex-col">
                <h3 className="text-sm font-bold mb-3 border-l-4 border-black pl-2">4. 장비 투입 현황</h3>
                <table className="w-full border-collapse border border-black text-[9pt]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black p-1">장비명</th>
                      <th className="border border-black p-1">규격</th>
                      <th className="border border-black p-1">수량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayEquipment.map((e, i) => (
                      <tr key={i}>
                        <td className="border border-black p-1">{e.name}</td>
                        <td className="border border-black p-1">{e.spec}</td>
                        <td className="border border-black p-1 text-right">{e.count}</td>
                      </tr>
                    ))}
                    {todayEquipment.length === 0 && (
                      <tr><td colSpan={3} className="border border-black p-4 text-center italic text-gray-400">데이터 없음</td></tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td colSpan={2} className="border border-black p-1 text-center">합 계</td>
                      <td className="border border-black p-1 text-right">{todayEquipment.reduce((acc, curr) => acc + curr.count, 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </section>
            </div>

            <section className="p-4 font-sans h-32">
              <h3 className="text-sm font-bold mb-3 border-l-4 border-black pl-2">5. 자재 및 특이사항</h3>
              <div className="grid grid-cols-2 gap-4 text-[9pt]">
                <div>
                  <p className="font-bold underline mb-1">자재 반입/반출:</p>
                  {todayMaterial.map((m, i) => (
                    <p key={i} className="pl-2">-{m.name}({m.spec}): {m.inCount > 0 ? `반입 ${m.inCount}${m.unit}` : ''} {m.outCount > 0 ? `반출 ${m.outCount}${m.unit}` : ''}</p>
                  ))}
                  {todayMaterial.length === 0 && <p className="pl-2 text-gray-400">- 특이사항 없음</p>}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .main-view {
             padding: 0 !important;
          }
           header {
             display: none !important;
           }
          #a4-report {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
