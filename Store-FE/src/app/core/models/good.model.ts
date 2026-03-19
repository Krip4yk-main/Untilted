import { z } from 'zod';

export const ZTGoodType = z.union([
    z.literal('poly'),
    z.literal('poly_lam'),
    z.literal('SLA'),
    z.literal('FDM'),
    z.literal('wood'),
    z.literal('clothes'),
]);
export const ZTStorageType = z.union([z.literal('items'), z.literal('meters')]);
export const ZIGoodTemplate = z.object({
    uniqueId: z.string().nullable(),
    uniqueCode: z.string().nullable(),
    name: z.string(),
    type: ZTGoodType,
    imageUrl: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    notes: z.string(),
    storage: z.number(),
    storageType: ZTStorageType,
    nullPrice: z.number(),
    sellPrice: z.number(),
    wholePrice: z.number(),
    wholeCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    updatedBy: z.string(),
    deleted: z.boolean(),
});
export const ZIPriceHistoryRecord = z.object({
    id: z.number(),
    goodId: z.number(),
    price: z.number(),
    createdAt: z.string(),
    createdBy: z.string(),
    deleted: z.boolean(),
});
export const ZIGood = ZIGoodTemplate.extend({
    id: z.number(),
    priceHistory: z.array(ZIPriceHistoryRecord),
});

export type TGoodType = z.infer<typeof ZTGoodType>;
export type TStorageType = z.infer<typeof ZTStorageType>;
export type IGoodTemplate = z.infer<typeof ZIGoodTemplate>;
export type IPriceHistoryRecord = z.infer<typeof ZIPriceHistoryRecord>;
export type IGood = z.infer<typeof ZIGood>;

export const emptyGoodTemplate: IGoodTemplate = {
    uniqueId: null,
    uniqueCode: null,
    name: '',
    type: 'FDM',
    imageUrl: '',
    description: '',
    shortDescription: '',
    notes: '',
    storage: 0,
    storageType: 'items',
    nullPrice: 0,
    sellPrice: 0,
    wholePrice: 0,
    wholeCount: 0,
    createdAt: '-1',
    updatedAt: '-1',
    createdBy: '',
    updatedBy: '',
    deleted: false,
};
export const emptyGood: IGood = {
    ...emptyGoodTemplate,
    id: -1,
    priceHistory: [],
};
