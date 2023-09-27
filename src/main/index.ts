import { FrameWorkAdapter } from "./adapters";
import { Env, routes } from "./config";

const framework = new FrameWorkAdapter(routes, Env.PORT);
framework.start();
