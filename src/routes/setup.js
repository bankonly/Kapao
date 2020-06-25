/** Router import */
import unAuthenticateRouter from "./app";

/** configs */
import kernel from "../configs/kernel";

export default (app) => {
  /** Api Authenticate Router Group */
  // app.use(kernel.routes.api, []);

  /** unAuthenticate Router */
  app.use("/app", unAuthenticateRouter);
};
