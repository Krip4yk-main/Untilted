import type { TDBTable } from '../../Configurations/database.types.js';
import { AzureDB } from '../../Configurations/database.js';
import {
    emptyPriceHistoryRecord,
    type IPriceHistoryRecord,
    type IPriceHistoryRecordRaw,
} from '../../Models/goodsPriceHistory.model.js';
import type { TAnyObject } from '../../Core/utils.types.js';

export class HistoryService {

    TABLE_NAME: TDBTable = 'Goods_price_history';

    public async getHistoryById(id: number): Promise<IPriceHistoryRecord | null> {
        const column: keyof IPriceHistoryRecordRaw = 'id'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IPriceHistoryRecordRaw);
    }

    public async getHistoryByGoodId(id: number): Promise<IPriceHistoryRecord[] | null> {
        const column: keyof IPriceHistoryRecordRaw = 'good_id'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertFromRawArr(res as IPriceHistoryRecordRaw[]);
    }

    public async createHistory(data: Partial<IPriceHistoryRecord>): Promise<IPriceHistoryRecord | null> {
        const rawData = this.convertToRaw(data);
        const res: unknown[] | null = await AzureDB.insert(this.TABLE_NAME, rawData);
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IPriceHistoryRecordRaw);
    }

    public async updateHistory(id: number, data: Partial<IPriceHistoryRecord>): Promise<[] | null> {
        const existingHistory = await this.getHistoryById(id);
        if (!existingHistory) {
            return null;
        }
        const rawData = this.convertToRaw(data);
        const res: unknown[] | null = await AzureDB.updateByID(this.TABLE_NAME, id, rawData);
        if (!res) {
            return res;
        }
        return [];
    }

    public async deleteHistory(id: number): Promise<IPriceHistoryRecord | null> {
        const existingHistory = await this.getHistoryById(id);
        if (!existingHistory) {
            return null;
        }
        const res: unknown[] | null = await AzureDB.softDeleteByID(this.TABLE_NAME, id);
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IPriceHistoryRecordRaw);
    }

    convertFromRaw(data: IPriceHistoryRecordRaw): IPriceHistoryRecord {
        return {
            id: data.id,
            goodId: data.good_id,
            price: data.price,
            createdAt: data.created_at,
            createdBy: data.created_by,
            deleted: data.deleted,
        };
    }

    convertFromRawArr(data: IPriceHistoryRecordRaw[]): IPriceHistoryRecord[] {
        return data.map(this.convertFromRaw);
    }

    convertToRaw(data: IPriceHistoryRecord | Partial<IPriceHistoryRecord>): Partial<IPriceHistoryRecordRaw> {
        const result: TAnyObject = {};
        const keysPairs: [keyof IPriceHistoryRecord, keyof IPriceHistoryRecordRaw][] = [
            ['id', 'id'],
            ['goodId', 'good_id'],
            ['price', 'price'],
            ['createdAt', 'created_at'],
            ['createdBy', 'created_by'],
            ['deleted', 'deleted'],
        ];

        if (Object.keys(emptyPriceHistoryRecord).length !== keysPairs.length) {
            throw new Error('Keys length mismatch. Update IPriceHistoryRecord model');
        }

        for (const pair of keysPairs) {
            if (data[pair[0]] === undefined) {
                continue;
            }

            result[pair[1]] = data[pair[0]];
        }

        return result as Partial<IPriceHistoryRecordRaw>;
    }

    convertToRawArr(data: IPriceHistoryRecord[] | Partial<IPriceHistoryRecord>[]): Partial<IPriceHistoryRecordRaw>[] {
        return data.map(this.convertToRaw);
    }

}

export const historyService = new HistoryService();
