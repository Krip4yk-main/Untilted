import type { IPriceHistoryRecord } from './goodsPriceHistory.model.js';

export type TGoodType = 'poly' | 'poly_lam' | 'SLA' | 'FDM' | 'wood' | 'clothes';
export type TStorageType = 'items' | 'meters';

export interface IGoodTemplate {
    uniqueId: string | null;
    uniqueCode: string | null;
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
    createdAt: string; // timestamp
    updatedAt: string; // timestamp
    createdBy: string;
    updatedBy: string;
    deleted: boolean;
}

export interface IGood extends IGoodTemplate {
    id: number;
    priceHistory: IPriceHistoryRecord[];
}

export const emptyGoodTemplate: IGoodTemplate = {
    uniqueId: null,
    uniqueCode: null,
    name: '',
    type: 'FDM',
    imageUrl: '',
    description: '',
    shortDescription: '',
    notes: '',
    storage: 0,
    storageType: 'items',
    nullPrice: 0,
    sellPrice: 0,
    wholePrice: 0,
    wholeCount: 0,
    createdAt: '-1',
    updatedAt: '-1',
    createdBy: '',
    updatedBy: '',
    deleted: false,
};

export interface IGoodRawTemplate {
    unique_id: string | null;
    unique_code: string | null;
    name: string;
    type: TGoodType;
    image_url: string;
    description: string;
    short_description: string;
    notes: string;
    storage: number;
    storage_type: TStorageType;
    null_price: number;
    sell_price: number;
    whole_price: number;
    whole_count: number;
    created_at: string; // timestamp
    updated_at: string; // timestamp
    created_by: string;
    updated_by: string;
    deleted: boolean;
}

export interface IGoodRaw {
    id: number;
    unique_id: string | null;
    unique_code: string | null;
    name: string;
    type: TGoodType;
    image_url: string;
    description: string;
    short_description: string;
    notes: string;
    storage: number;
    storage_type: TStorageType;
    null_price: number;
    sell_price: number;
    whole_price: number;
    whole_count: number;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
    deleted: boolean;
}
