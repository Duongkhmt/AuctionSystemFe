export enum ProductStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum AuctionStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SCHEDULED = 'SCHEDULED',
  RUNNING = 'RUNNING',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum AuctionType {
  ENGLISH = 'ENGLISH',
  RESERVE = 'RESERVE',
  BUY_NOW = 'BUY_NOW'
}

export type UserRole = 'USER' | 'ADMIN';

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  accessToken?: string;
  refreshToken?: string;
}
