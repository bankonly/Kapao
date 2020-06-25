import bodyParser from "body-parser"
import cors from "cors"
import passport from "passport"

export default app => {
     // passport initialize
  app.use(passport.initialize());

  // allow cors origin
  app.use(cors());

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  // parse application/json
  app.use(bodyParser.json());
};
