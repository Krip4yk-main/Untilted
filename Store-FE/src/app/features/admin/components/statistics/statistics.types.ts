export interface IStatFilters {
    dateFrom: string;
    dateTo: string;
    userId: string;
    goodId: string;
    priceMin: number;
    priceMax: number;
}

export const defaultStatFilters: IStatFilters = {
    dateFrom: '',
    dateTo: '',
    userId: '',
    goodId: '',
    priceMin: 0,
    priceMax: 0,
};

export interface IStat {
    totalRevenue: number;
    totalSales: number;
    itemsChart: IStatItem[];
}

export interface IStatItem {
    name: string;
    count: number;
    percent: number;
}
