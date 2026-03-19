export type TAnyDefined = number | string | boolean | object;
export type TAny = TAnyDefined | null | undefined;
export type TNumString = `${number}`;
export type TInterfaceRecord<T> = {
    [K in keyof T]: T[K];
};
