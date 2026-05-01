/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Site } from './types';

export const INITIAL_SITES: Site[] = [
  {
    id: 'site-1',
    name: '한수원 홍보관 신축공사',
    client: '한국수력원자력',
    contractor: '(주)A건설',
    address: '경북 경주시 문무대왕면',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    contractAmount: 5000000000,
    manager: '김소장',
    supervisor: '이감리',
    partners: ['명성건축', '대우설비', '현대조경'],
    notes: '홍보관 신축 프로젝트'
  },
  {
    id: 'site-2',
    name: '경주 한옥스테이 리모델링',
    client: '개인건축주',
    contractor: '(주)B건축',
    address: '경북 경주시 황남동',
    startDate: '2024-03-15',
    endDate: '2024-07-15',
    contractAmount: 850000000,
    manager: '박소장',
    supervisor: '최감리',
    partners: ['한옥전문', '토속인테리어'],
    notes: '전통 한옥 리모델링'
  },
  {
    id: 'site-3',
    name: '감포 카페 인테리어',
    client: '카페씨웨이브',
    contractor: '디자인공간',
    address: '경북 경주시 감포읍',
    startDate: '2024-05-01',
    endDate: '2024-06-30',
    contractAmount: 200000000,
    manager: '정팀장',
    supervisor: '나감리',
    partners: ['유리공예', '조명나라'],
    notes: '바다 전망 카페 인테리어'
  },
  {
    id: 'site-4',
    name: '의성 공장 내부공사',
    client: '미래산업',
    contractor: '한솔기술',
    address: '경북 의성군 봉양면',
    startDate: '2024-02-10',
    endDate: '2024-05-20',
    contractAmount: 1200000000,
    manager: '송부장',
    supervisor: '장실장',
    partners: ['철강산업', '전기명인'],
    notes: '공장 생산라인 보수 및 확장'
  }
];
