import type { TDBTable } from '../../Configurations/database.types.js';
import type { IGood, IGoodRaw } from '../../Models/good.model.js';
import { AzureDB } from '../../Configurations/database.js';
import type { TNumString } from '../../Core/utils.types.js';
import type { IPriceHistoryRecord } from '../../Models/goodsPriceHistory.model.js';
import { historyService } from './historyService.js';

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
        return this.convertRawGoods(res as IGoodRaw[]);
    }

    public async getGoodById(id: number): Promise<IGood | null> {
        const column: keyof IGoodRaw = 'id'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertRawGood(res[0] as IGoodRaw);
    }

    public async getGoodByUniqueId(id: string): Promise<IGood | null> {
        const column: keyof IGoodRaw = 'unique_id'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertRawGood(res[0] as IGoodRaw);
    }

    public async getGoodByUniqueCode(id: TNumString): Promise<IGood | null> {
        const column: keyof IGoodRaw = 'unique_code'; // mandatory type check
        const res: unknown[] | null = await AzureDB.readByKey(this.TABLE_NAME, id, column);
        if (!res) {
            return res;
        }
        return this.convertRawGood(res[0] as IGoodRaw);
    }

    public async createGood(good: Partial<IGood>): Promise<IGood | null> {
        const res: unknown[] | null = await AzureDB.insert(this.TABLE_NAME, good);
        if (!res) {
            return res;
        }
        return this.convertRawGood(res[0] as IGoodRaw);
    }

    public async updateGood(id: number, good: Partial<IGood>): Promise<[] | null> {
        const existingGood = await this.getGoodById(id);
        if (!existingGood) {
            return null;
        }
        const res: unknown[] | null = await AzureDB.updateByID(this.TABLE_NAME, id, good);
        if (!res) {
            return res;
        }
        return [];
    }

    public async deleteGood(id: number): Promise<IGood | null> {
        const existingGood = await this.getGoodById(id);
        if (!existingGood) {
            return null;
        }
        const res: unknown[] | null = await AzureDB.softDeleteByID(this.TABLE_NAME, id);
        if (!res) {
            return res;
        }
        return this.convertRawGood(res[0] as IGoodRaw);
    }

    async convertRawGood(data: IGoodRaw): Promise<IGood> {
        const history: IPriceHistoryRecord[] | null =
            await historyService.getHistoryByGoodId(data.id);
        return {
            id: data.id,
            uniqueId: data.unique_id,
            uniqueCode: data.unique_code,
            name: data.name,
            type: data.type,
            imageUrl: data.image_url,
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

    async convertRawGoods(data: IGoodRaw[]): Promise<IGood[]> {
        const results: IGood[] = [];
        const promises = [];
        for (const good of data) {
            promises.push(this.convertRawGood(good)
                .then((res: IGood) => {
                    results.push(res);
                })
                .catch(console.error));
        }
        await Promise.all(promises);
        return results;
    }

}

export const goodsService = GoodsService.getInstance();
