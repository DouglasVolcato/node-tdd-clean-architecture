import { DatabaseConnector } from "../infra/database";
import { FrameWorkAdapter } from "./adapters";
import { Env } from "./config";
import { loginRoutes, userRoutes } from "./routes";

const vars = new Env().getVariables();
const routes = [...userRoutes, ...loginRoutes];
const framework = new FrameWorkAdapter(routes, vars.PORT);
const databaseConnector = new DatabaseConnector();

databaseConnector.connect(vars.DB_URL).then(async () => {
  await framework.start().then(() => {
    console.log(`Server is running on port ${vars.PORT}`);
  });
});
