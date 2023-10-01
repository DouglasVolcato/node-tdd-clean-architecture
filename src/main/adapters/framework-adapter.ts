import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { RouteDtoType, RouteEnumType } from "../abstract";

export class FrameWorkAdapter {
  private readonly routes: RouteDtoType[];
  private readonly app: Express;
  private readonly port: number;
  private server: any;

  public constructor(routes: RouteDtoType[], port: number) {
    this.routes = routes;
    this.port = port;
    this.server = null;
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  public async start(): Promise<void> {
    this.server = this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  public stop(): void {
    if (this.server) {
      this.server.close(() => {
        console.log(`Server stopped`);
      });
      this.server = null;
    }
  }

  private setupMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private setupRoutes(): void {
    for (const route of this.routes) {
      this.app[route.type](route.url, async (req: Request, res: Response) => {
        const response = await route.controller.execute(req.body);
        const isError = response.data instanceof Error;
        const body = isError ? { error: response.data.message } : response.data;
        res.status(response.statusCode).json(body);
      });
    }
  }
}
