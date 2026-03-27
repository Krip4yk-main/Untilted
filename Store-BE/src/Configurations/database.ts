import sql from 'mssql';
import type { TDBInputType, TDBTable } from './database.types.js';

export class DatabaseConfig {

    private static instance: DatabaseConfig;

    poolConnection: sql.ConnectionPool | undefined;

    private constructor() {
        // intentionally empty
    }

    public static getInstance(): DatabaseConfig {
        if (!DatabaseConfig.instance) {
            DatabaseConfig.instance = new DatabaseConfig();
        }
        return DatabaseConfig.instance;
    }

    public async connect(): Promise<void> {
        console.info('Connecting to Azure Database...');

        const dbUrl: string = process.env.DB_URL || '';
        const dbPort: number = parseInt(process.env.DB_PORT || '') || 1433;
        const dbHost: string = process.env.DB_HOST || '';
        const dbDatabase: string = process.env.DB_DATABASE || '';
        const dbUser: string = process.env.DB_USER || '';
        const dbPassword: string = process.env.DB_PASSWORD || '';

        if (!dbUrl || !dbPort || !dbHost || !dbDatabase || !dbUser || !dbPassword) {
            throw new Error('Database configuration is missing');
        }

        const config: sql.config = {
            user: dbUser,
            password: dbPassword,
            server: dbHost,
            port: dbPort,
            database: dbDatabase || 'store',
            options: {
                encrypt: true, // For Azure
                trustServerCertificate: true,
            },
        };

        try {
            this.poolConnection = await sql.connect(config);

            console.info('Database connection established successfully');
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            throw error;
        }
    }

    getRequest(): sql.Request {
        return this.poolConnection!.request();
    }

    getSqlStringType(value: string) {
        return sql.NVarChar((value.length < 256) ? 255 : value.length);
    }

    async executeQuery(request: sql.Request, query: string): Promise<sql.IResult<unknown>> {
        return await request.query(query);
    }

    async insert<T extends object>(table: TDBTable, data: T) {
        if (Array.isArray(data)) {
            return null;
        }

        const request = this.getRequest();

        const keys = Object.keys(data);
        let insertionKeys: string = '';
        let insertionValues: string = '';
        for (const key of keys) {
            // validate type
            const rKey = key as keyof T;
            let type: TDBInputType | null;
            switch (typeof data[rKey]) {
            case 'string': {
                if (RegExp('[a-zA-Z0-9]').test(data[rKey])) {
                    type = sql.VarChar(data[rKey].length);
                } else {
                    type = sql.NVarChar(data[rKey].length);
                }
                break;
            }
            case 'number': {
                type = sql.Int;
                break;
            }
            case 'boolean': {
                type = sql.Bit;
                break;
            }
            default: {
                if (data[rKey] === null) {
                    type = null;
                    break;
                }
                throw new Error(`Unsupported data type for key '${key}': ${typeof data[rKey]}`);
            }
            }

            if (type === null) {
                continue;
            }
            request.input(key, type, data[rKey]);
            insertionKeys += `${key}, `;
            insertionValues += `@${key}, `;
        }
        insertionKeys = insertionKeys.slice(0, -2);
        insertionValues = insertionValues.slice(0, -2);
        insertionKeys = `(${insertionKeys})`;
        insertionValues = `(${insertionValues})`;

        const result = await this.executeQuery(request, `INSERT INTO ${table} ${insertionKeys} VALUES ${insertionValues}`);
        if (result.rowsAffected?.[0] !== 1) {
            return null;
        }
        return [];
    }

    async readAll(table: TDBTable) {
        const request = this.getRequest();
        const result = await this.executeQuery(request, `SELECT *
                                                         FROM ${table}
                                                         WHERE deleted = 0`);
        return result.recordset;
    }

    async readLast(table: TDBTable) {
        const request = this.getRequest();
        const result = await this.executeQuery(request, `SELECT TOP 1 *
                                                         FROM ${table}
                                                         WHERE deleted = 0
                                                         ORDER BY id DESC`);
        return result.recordset;
    }

    async readByKey(table: TDBTable, value: number | string, key: string) {
        const request = this.getRequest();

        if (typeof value === 'string') {
            request.input(key, this.getSqlStringType(value as string), value);
        } else {
            request.input(key, sql.Int, +value);
        }

        const result = await this.executeQuery(request, `SELECT *
                                                         FROM ${table}
                                                         WHERE ${key} = @${key}
                                                           AND deleted = 0`);
        return result.recordset;
    }

    async updateByID<T extends object>(table: TDBTable, id: number, data: T) {
        const request = this.getRequest();

        request.input('id', sql.Int, +id);

        const keys = Object.keys(data);
        let insertionKeys: string = '';
        for (const key of keys) {
            // validate type
            const rKey = key as keyof T;
            let type: TDBInputType;
            switch (typeof data[rKey]) {
            case 'string': {
                if (key.toLowerCase().includes('date')) {
                    type = sql.Date;
                    break;
                }
                type = this.getSqlStringType(data[rKey]);
                break;
            }
            case 'number': {
                type = sql.Int;
                break;
            }
            default: {
                throw new Error(`Unsupported data type for key '${key}': ${typeof data[rKey]}`);
            }
            }

            request.input(key, type, data[rKey]);
            insertionKeys += `${key} = @${key}, `;
        }
        insertionKeys = insertionKeys.slice(0, -2);

        const result = await this.executeQuery(request, `UPDATE ${table}
                                                         SET ${insertionKeys}
                                                         WHERE id = @id
                                                           AND deleted = 0`);

        if (result.rowsAffected?.[0] !== 1) {
            return null;
        }
        return [];
    }

    async softDeleteByID(table: TDBTable, id: number) {
        return this.updateByID(table, id, { deleted: true });
    }

}

export const AzureDB = DatabaseConfig.getInstance();
