import { TNumString } from '../services/utils.types';

export type TGoodType = 'poly' | 'poly_lam' | 'SLA' | 'FDM' | 'wood' | 'clothes';
export type TStorageType = 'items' | 'meters';

export interface IPriceHistoryRecord {
    id: number;
    goodId: number;
    price: number;
    createdAt: string;
    createdBy: string;
    deleted: boolean;
}

export interface IGoodTemplate {
    uniqueId: string | null;
    uniqueCode: TNumString | null;
    name: string;
    type: TGoodType;
    imageUrl: string;
    description: string;
    shortDescription: string;
    notes: string;
    storage: number;
    storageType: TStorageType;
    nullPrice: number;
    sellPrice: number;
    wholePrice: number;
    wholeCount: number;
    createdAt: TNumString; // timestamp
    updatedAt: TNumString; // timestamp
    createdBy: string;
    updatedBy: string;
    deleted: boolean;
}

export interface IGood extends IGoodTemplate {
    id: number;
    priceHistory: IPriceHistoryRecord[];
}

