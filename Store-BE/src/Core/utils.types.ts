export type TPromisable<T> = T | Promise<T>;
export type TPromisableLike<T> = T | PromiseLike<T>;
export type TPromisableFunc<T> = (value: TPromisable<T>) => void;
export type TPromisableLikeFunc<T> = (value: TPromisableLike<T>) => void;
export type TDefaultPromisableFunc = TPromisableFunc<void>;
export type TDefaultPromisableLikeFunc = TPromisableLikeFunc<void>;
