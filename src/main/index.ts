import { DatabaseConnector } from "../infra/database";
import { FrameWorkAdapter } from "./adapters";
import { Env, userRoutes } from "./config";

const vars = new Env().getVaiables();
const framework = new FrameWorkAdapter([...userRoutes], vars.PORT);
const databaseConnector = new DatabaseConnector();

databaseConnector.connect(vars.DB_URL).then(() => {
  framework.start();
});
