import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { createServer, Server } from 'http';
import router from './router.js';
import { AzureDB } from './Configurations/database.js';

class App {

    private static instance: App;
    public app: Express;
    public server: Server;
    public port: number | string;

    private constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.server = createServer(this.app);
    }

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    public async initialize(): Promise<void> {
        this.configureMiddleware();
        this.configureRoutes();
        try {
            await AzureDB.connect();
        } catch (error: unknown) {
            console.error(error);
            process.exit(1);
        }
    }

    private configureMiddleware(): void {
        this.app.use(express.json());

        // CORS middleware
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });
    }

    private configureRoutes(): void {
        this.app.use('/api', router);
    }

    public listen(): void {
        this.server.listen(this.port, () => {
            console.info(`Server is running at http://localhost:${this.port}`);
        });
    }

}

export const appInstance = App.getInstance();
