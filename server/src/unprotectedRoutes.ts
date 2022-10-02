import Router from "@koa/router";
import { general } from "./controller";
import AuthController from "./controller/auth";

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get("/", general.helloWorld);
unprotectedRouter.post("/auth/login", AuthController.login);

export { unprotectedRouter };