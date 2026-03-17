export interface IPriceHistoryRecord {
    id: number;
    goodId: number;
    price: number;
    createdAt: string;
    createdBy: string;
    deleted: boolean;
}

export const emptyPriceHistoryRecord: IPriceHistoryRecord = {
    id: 0,
    goodId: 0,
    price: 0,
    createdAt: '',
    createdBy: '',
    deleted: false,
};

export interface IPriceHistoryRecordRaw {
    id: number;
    good_id: number;
    price: number;
    created_at: string;
    created_by: string;
    deleted: boolean;
}
