import type { TNumString } from '../Core/utils.types.js';
import type { IPriceHistoryRecord } from './goodsPriceHistory.model.js';

export type TGoodType = 'poly' | 'poly_lam' | 'SLA' | 'FDM' | 'wood' | 'clothes';
export type TStorageType = 'items' | 'meters';

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

export interface IGoodRawTemplate {
    unique_id: string | null;
    unique_code: TNumString | null;
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
    created_at: TNumString; // timestamp
    updated_at: TNumString; // timestamp
    created_by: string;
    updated_by: string;
    deleted: boolean;
}

export interface IGoodRaw {
    id: number;
    unique_id: string | null;
    unique_code: TNumString | null;
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
    created_at: TNumString;
    updated_at: TNumString;
    created_by: string;
    updated_by: string;
    deleted: boolean;
}
