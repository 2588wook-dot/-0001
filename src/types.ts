/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Site {
  id: string;
  name: string;
  client: string; // 발주처
  contractor: string; // 시공사
  address: string;
  startDate: string;
  endDate: string;
  contractAmount: number; // 관리자 전용
  manager: string; // 현장소장
  supervisor: string; // 감리자
  partners: string[]; // 협력업체
  notes: string;
}

export interface WorkLog {
  id: string;
  siteId: string;
  date: string;
  weather: string;
  todayWork: string;
  tomorrowWork: string;
}

export interface PersonnelLog {
  id: string;
  siteId: string;
  date: string;
  partnerName: string;
  count: number;
  trade: string; // 공종 (목수, 철근 등)
}

export interface EquipmentLog {
  id: string;
  siteId: string;
  date: string;
  name: string;
  spec: string;
  count: number;
}

export interface MaterialLog {
  id: string;
  siteId: string;
  date: string;
  name: string;
  spec: string;
  unit: string;
  inCount: number;
  outCount: number;
}

export interface Photo {
  id: string;
  siteId: string;
  date: string;
  url: string;
  description: string;
}

export interface AdminFinance {
  siteId: string;
  budget: number;
  actualCost: number;
  laborUnitCosts: { [trade: string]: number };
  partnerPayments: {
    [partnerName: string]: {
      contractAmount: number; // 계약금액
      advance: number; // 선금
      interim: number; // 중도금
      balance: number; // 잔금
      status: 'pending' | 'partially_paid' | 'completed';
    }
  };
}

export interface WeeklySchedule {
  id: string;
  siteId: string;
  weekRange: string;
  content: string;
  items: {
    trade: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  }[];
}

export interface Appointment {
  id: string;
  siteId: string;
  date: string;
  time: string;
  title: string;
  person: string;
  completed: boolean;
}

export interface OrderItem {
  id: string;
  siteId: string;
  date: string;
  name: string;
  spec: string;
  qty: string;
  partner: string;
  status: 'ORDERED' | 'ARRIVED' | 'PENDING';
}

export interface Blueprint {
  id: string;
  siteId: string;
  name: string;
  url: string;
  uploadDate: string;
  category: string;
}

export interface ProjectMemo {
  id: string;
  siteId: string;
  date: string;
  content: string;
  category: 'IMPORTANT' | 'NORMAL' | 'ISSUE';
}
