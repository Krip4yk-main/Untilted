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

export const emptyPriceHistoryRecordTemplate: IPriceHistoryRecordTemplate = {
    goodId: 0,
    price: 0,
    createdAt: '',
    createdBy: '',
    deleted: false,
};

export interface IPriceHistoryRecordTemplateRaw {
    good_id: number;
    price: number;
    created_at: string;
    created_by: string;
    deleted: boolean;
}

export interface IPriceHistoryRecordRaw extends IPriceHistoryRecordTemplateRaw {
    id: number;
}
