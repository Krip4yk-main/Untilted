import type { TDBTable } from '../../Configurations/database.types.js';
import {
    emptyGoodTemplate,
    type IGood,
    type IGoodRaw,
    type IGoodRawTemplate,
    type IGoodTemplate,
} from '../../Models/good.model.js';
import { AzureDB } from '../../Configurations/database.js';
import type { TAnyObject, TNumString } from '../../Core/utils.types.js';
import { type IPriceHistoryRecord } from '../../Models/goodsPriceHistory.model.js';
import { historyService } from './historyService.js';
import moment from 'moment';

export class GoodsService {

    private static instance: GoodsService;

    TABLE_NAME: TDBTable = 'Goods';

    private constructor() {
        // intentionally empty
    }

    public static getInstance(): GoodsService {
        if (!GoodsService.instance) {
            GoodsService.instance = new GoodsService();
        }
        return GoodsService.instance;
    }

    public async getGoods(): Promise<IGood[] | null> {
        const res: unknown[] | null = await AzureDB.readAll(this.TABLE_NAME);
        if (!res) {
            return res;
        }
        return this.convertFromRawArr(res as IGoodRaw[]);
    }

    public async getGoodById(id: number): Promise<IGood | null> {
        const column: keyof IGoodRaw = 'id'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IGoodRaw);
    }

    public async getGoodByUniqueId(id: string): Promise<IGood | null> {
        const column: keyof IGoodRaw = 'unique_id'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IGoodRaw);
    }

    public async getGoodByUniqueCode(id: TNumString): Promise<IGood | null> {
        const column: keyof IGoodRaw = 'unique_code'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IGoodRaw);
    }

    public async createGood(data: Partial<IGood>): Promise<IGood | null> {
        const dataRaw = {
            ...this.convertToRaw(data),
            created_at: `${moment().unix() * 1000}`,
            updated_at: `${moment().unix() * 1000}`,
        };
        console.log('dataRaw', dataRaw);
        const res: unknown[] | null = await AzureDB.insert(this.TABLE_NAME, dataRaw);
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IGoodRaw);
    }

    public async updateGood(id: number, data: Partial<IGood>): Promise<[] | null> {
        const existingGood = await this.getGoodById(id);
        if (!existingGood) {
            return null;
        }
        const dataRaw = {
            ...this.convertToRaw(data),
            updated_at: `${moment().unix() * 1000}`,
        };
        const res: unknown[] | null = await AzureDB.updateByID(this.TABLE_NAME, id, dataRaw);
        if (!res) {
            return null;
        }
        return [];
    }

    public async deleteGood(id: number): Promise<[] | null> {
        const existingGood = await this.getGoodById(id);
        if (!existingGood) {
            return null;
        }
        const res: unknown[] | null = await AzureDB.softDeleteByID(this.TABLE_NAME, id);
        if (!res) {
            return null;
        }
        return [];
    }

    async convertFromRaw(data: IGoodRaw): Promise<IGood> {
        const history: IPriceHistoryRecord[] | null =
            await historyService.getHistoryByGoodId(data.id);
        return {
            id: data.id,
            uniqueId: data.unique_id,
            uniqueCode: data.unique_code,
            name: data.name,
            type: data.type,
            imageUrl: data.image_url,
            description: data.description,
            shortDescription: data.short_description,
            notes: data.notes,
            storage: data.storage,
            storageType: data.storage_type,
            nullPrice: data.null_price,
            sellPrice: data.sell_price,
            wholePrice: data.whole_price,
            wholeCount: data.whole_count,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            deleted: data.deleted,
            priceHistory: history || [],
        };
    }

    async convertFromRawArr(data: IGoodRaw[]): Promise<IGood[]> {
        const results: IGood[] = [];
        const promises = [];
        for (const good of data) {
            promises.push(this.convertFromRaw(good)
                .then((res: IGood) => {
                    results.push(res);
                })
                .catch(console.error));
        }
        await Promise.all(promises);
        return results;
    }

    convertToRaw(data: IGoodTemplate | Partial<IGoodTemplate>): Partial<IGoodRawTemplate> {
        const result: TAnyObject = {};
        const keysPairs: [keyof IGoodTemplate, keyof IGoodRawTemplate][] = [
            ['uniqueId', 'unique_id'],
            ['uniqueCode', 'unique_code'],
            ['name', 'name'],
            ['type', 'type'],
            ['imageUrl', 'image_url'],
            ['description', 'description'],
            ['shortDescription', 'short_description'],
            ['notes', 'notes'],
            ['storage', 'storage'],
            ['storageType', 'storage_type'],
            ['nullPrice', 'null_price'],
            ['sellPrice', 'sell_price'],
            ['wholePrice', 'whole_price'],
            ['wholeCount', 'whole_count'],
            ['createdAt', 'created_at'],
            ['updatedAt', 'updated_at'],
            ['createdBy', 'created_by'],
            ['updatedBy', 'updated_by'],
            ['deleted', 'deleted'],
        ];

        if (Object.keys(emptyGoodTemplate).length !== keysPairs.length) {
            throw new Error('Keys length mismatch. Update IPriceHistoryRecord model');
        }

        for (const pair of keysPairs) {
            if (data[pair[0]] === undefined) {
                continue;
            }

            result[pair[1]] = data[pair[0]];
        }

        return result as Partial<IGoodRawTemplate>;
    }

    convertToRawArr(data: IGoodTemplate[] | Partial<IGood>[]): Partial<IGoodRawTemplate>[] {
        return data.map(this.convertToRaw);
    }

}

export const goodsService = GoodsService.getInstance();
