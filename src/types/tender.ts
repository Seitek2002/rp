export interface TenderUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export type TenderStatus = 'bidding' | 'new' | 'evaluated' | 'finished' | 'cancelled';

export interface Tender {
  id: number;
  name: string;
  description: string;
  terms: string;
  endDate: string; // ISO datetime string
  createdBy: TenderUser;
  status: TenderStatus;
  closeReason: string | null;
  products: number[];
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  productsCount: number;
  bidsCount: number;
}

export type TenderList = Tender[];
