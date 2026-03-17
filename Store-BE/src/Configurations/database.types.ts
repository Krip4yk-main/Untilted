import sql from 'mssql';

export type TDBInputType = (() => sql.ISqlType) | sql.ISqlType;

export type TDBTable = 'Users' | 'Goods' | 'Goods_price_history';
