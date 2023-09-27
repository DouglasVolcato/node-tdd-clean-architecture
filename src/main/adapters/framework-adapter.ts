import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { RouteDtoType, RouteEnumType } from "../abstract";

export class FrameWorkAdapter {
  private readonly routes: RouteDtoType[];
  private readonly app: Express;
  private readonly port: number;

  public constructor(routes: RouteDtoType[], port: number) {
    this.routes = routes;
    this.port = port;
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  public async start(): Promise<void> {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  private setupMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private setupRoutes(): void {
    for (const route of this.routes) {
      switch (route.type) {
        case RouteEnumType.GET:
          this.app.get(route.url, async (req: Request, res: Response) => {
            const response = await route.controller.execute(req.body);
            res.status(response.statusCode).json(response.data);
          });
          break;
        case RouteEnumType.POST:
          this.app.post(route.url, async (req: Request, res: Response) => {
            const response = await route.controller.execute(req.body);
            res.status(response.statusCode).json(response.data);
          });
          break;
        case RouteEnumType.PUT:
          this.app.put(route.url, async (req: Request, res: Response) => {
            const response = await route.controller.execute(req.body);
            res.status(response.statusCode).json(response.data);
          });
          break;
        case RouteEnumType.DELETE:
          this.app.delete(route.url, async (req: Request, res: Response) => {
            const response = await route.controller.execute(req.body);
            res.status(response.statusCode).json(response.data);
          });
          break;
        case RouteEnumType.PATCH:
          this.app.patch(route.url, async (req: Request, res: Response) => {
            const response = await route.controller.execute(req.body);
            res.status(response.statusCode).json(response.data);
          });
          break;
        default:
          break;
      }
    }
  }
}
