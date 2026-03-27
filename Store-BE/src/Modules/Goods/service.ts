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
import { authService } from '../../Core/auth.service.js';

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

    public async getGoodByCreatedDate(createdAt: string): Promise<IGood | null> {
        const res: unknown[] | null = await AzureDB.readLastByKey(this.TABLE_NAME, createdAt, 'created_at');
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IGoodRaw);
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
        const column: keyof IGoodRaw = 'unique_barcode'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertFromRaw(res[0] as IGoodRaw);
    }

    public async createGood(data: Partial<IGood>): Promise<IGood | null> {
        const date: string = moment().toISOString();
        const dataRaw = this.convertToRaw({
            ...data,
            createdBy: authService.loggedUserData!.preferred_username,
            updatedBy: authService.loggedUserData!.preferred_username,
            createdAt: date,
            updatedAt: date,
        });
        const res: unknown[] | null = await AzureDB.insert(this.TABLE_NAME, dataRaw);
        if (!res) {
            return res;
        }
        return this.getGoodByCreatedDate(dataRaw.created_at!);
    }

    public async updateGood(id: number, data: Partial<IGood>): Promise<IGood | null> {
        const existingGood = await this.getGoodById(id);
        if (!existingGood) {
            return null;
        }
        const dataRaw = this.convertToRaw({
            ...data,
            updatedBy: authService.loggedUserData!.preferred_username,
            updatedAt: moment().toISOString(),
        });
        const res: unknown[] | null = await AzureDB.updateByID(this.TABLE_NAME, id, dataRaw);
        if (!res) {
            return null;
        }
        return this.getGoodById(id);
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
            uniqueCode: data.unique_barcode,
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
            ['uniqueCode', 'unique_barcode'],
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

            if (pair[0] === 'deleted') {
                result[pair[1]] = data[pair[0]] ? 1 : 0;
                continue;
            }
            result[pair[1]] = data[pair[0]];
        }

        return result as Partial<IGoodRawTemplate>;
    }

    convertToRawArr(data: IGoodTemplate[] | Partial<IGood>[]): Partial<IGoodRawTemplate>[] {
        return data.map(this.convertToRaw);
    }

    async updatePriceHistory(data: IGood): Promise<void> {
        if (data.sellPrice !== null && data.sellPrice !== undefined) {
            if (!data.priceHistory) {
                throw new Error('Price history not found for good');
            }

            if (data.sellPrice !== data.priceHistory[data.priceHistory.length - 1]?.price) {
                const history = await historyService.createHistory({
                    goodId: data.id,
                    price: data.sellPrice,
                    createdAt: moment().toISOString(),
                    createdBy: authService.loggedUserData!.preferred_username,
                    deleted: false,
                });

                if (!history) {
                    throw new Error('Failed to create history');
                }
            }
        }
    }

}

export const goodsService = GoodsService.getInstance();
