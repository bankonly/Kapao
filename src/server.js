import express from "express";
import log from "chalk";
import passport from "passport";

/** Config Import */
import default_config from "./configs/default_config";
import app_config from "./configs/app";
import database from "./configs/db";

const app = express();
/* LOAD ALL DEFAULT CONFIGURATIONS */
app_config(app);

/* ROUTES */
import setup_router from "./routes/setup";
setup_router(app);


/* LOAD IMAGE PATH */
app.use("/public", express.static(__dirname + "/storages"));

try {
  /* RUN PROGRAM BASE ON ENV PORT */
  app.listen(process.env.APP_PORT, error =>
    console.log("CONNECTED TO ", process.env.APP_PORT)
  );
} catch (error) {
  console.log(log.red(error.message));
}
