export interface Sale {
    id: number;
    userId: number | 'unknown';
    userName: string;
    goodId: number;
    goodName: string;
    price: number;
    date: string;
}
