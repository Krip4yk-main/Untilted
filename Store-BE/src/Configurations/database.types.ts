import sql from 'mssql';

export type TDBInputType = (() => sql.ISqlType) | sql.ISqlType;

export type TDBTable = 'Users';
export type TDBTableIds = 'Id' | 'TelegramId';
