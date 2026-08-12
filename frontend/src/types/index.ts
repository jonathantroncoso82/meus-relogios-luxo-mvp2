export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  country?: string;
  foundedYear?: number;
  website?: string;
  logoUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { watches: number };
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { watches: number };
  watches?: Watch[];
}

export type WatchCondition = 'mint' | 'excellent' | 'very_good' | 'good' | 'fair' | 'poor';
export type MovementType = 'automatic' | 'manual' | 'quartz' | 'solar' | 'kinetic' | 'spring_drive' | 'other';
export type GenderType = 'mens' | 'womens' | 'unisex';
export type AcquisitionType = 'purchased' | 'gifted' | 'inherited' | 'traded' | 'other';

export interface WatchImage {
  id: string;
  watchId: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Watch {
  id: string;
  userId: string;
  brandId: string;
  collectionId?: string;
  movementId?: string;
  model: string;
  referenceNumber?: string;
  serialNumber?: string;
  yearManufactured?: number;
  dialColor?: string;
  caseMaterial?: string;
  caseDiameterMm?: number;
  braceletMaterial?: string;
  waterResistanceM?: number;
  gender: GenderType;
  condition: WatchCondition;
  acquisitionType: AcquisitionType;
  acquisitionDate?: string;
  acquisitionPrice?: number;
  acquisitionCurrency?: string;
  currentValue?: number;
  notes?: string;
  isForSale: boolean;
  askingPrice?: number;
  createdAt: string;
  updatedAt: string;
  brand?: Pick<Brand, 'id' | 'name' | 'logoUrl'>;
  collection?: Pick<Collection, 'id' | 'name'>;
  images?: WatchImage[];
  serviceRecords?: ServiceRecord[];
  valuations?: Valuation[];
}

export interface ServiceRecord {
  id: string;
  watchId: string;
  serviceDate: string;
  serviceType: string;
  serviceCenter?: string;
  technician?: string;
  cost?: number;
  currency?: string;
  description?: string;
  nextServiceDate?: string;
  warrantyUntil?: string;
  createdAt: string;
  updatedAt: string;
  watch?: Pick<Watch, 'id' | 'model'> & { brand?: Pick<Brand, 'name'> };
}

export interface Valuation {
  id: string;
  watchId: string;
  valuationDate: string;
  appraiser?: string;
  marketValue: number;
  currency?: string;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  watch?: Pick<Watch, 'id' | 'model'> & { brand?: Pick<Brand, 'name'> };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
