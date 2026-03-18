export interface IPriceHistoryRecordTemplate {
    goodId: number;
    price: number;
    createdAt: string;
    createdBy: string;
    deleted: boolean;
}

export interface IPriceHistoryRecord extends IPriceHistoryRecordTemplate {
    id: number;
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
