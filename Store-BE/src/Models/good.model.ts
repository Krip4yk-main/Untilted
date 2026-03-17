import type { TNumString } from '../Core/utils.types.js';
import type { IPriceHistoryRecord } from './goodsPriceHistory.model.js';

export interface IGood {
    id: number;
    uniqueId: string | null;
    uniqueCode: TNumString | null;
    name: string;
    type: TGoodType;
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
    priceHistory: IPriceHistoryRecord[];
}

export type TGoodType = 'poly' | 'poly_lam' | 'SLA' | 'FDM' | 'wood' | 'clothes';
export type TStorageType = 'items' | 'meters';

export interface IGoodRaw {
    id: number;
    unique_id: string | null;
    unique_code: TNumString | null;
    name: string;
    type: TGoodType;
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
