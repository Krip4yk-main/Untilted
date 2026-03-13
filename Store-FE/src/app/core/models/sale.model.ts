export interface Sale {
    id: number;
    userId: string | 'unknown';
    userName: string;
    goodId: number;
    goodName: string;
    price: number;
    date: string;
}
