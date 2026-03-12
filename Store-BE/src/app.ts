import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { createServer, Server } from 'http';
import { DatabaseConfig } from './Configurations/database.js';
import goodsRouter from './Modules/Goods/route.js';
import usersRouter from './Modules/Users/route.js';

class App {
  private static instance: App;
  public app: Express;
  public server: Server;
  public port: number | string;

  private constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = createServer(this.app);
    this.initialize();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  private async initialize(): Promise<void> {
    this.configureMiddleware();
    this.configureRoutes();
    try {
      await DatabaseConfig.connect();
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
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
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Store-BE is running with modular architecture');
    });

    // Register module routes
    this.app.use('/api/goods', goodsRouter);
    this.app.use('/api/users', usersRouter);
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running at http://localhost:${this.port}`);
    });
  }
}

export const appInstance = App.getInstance();
