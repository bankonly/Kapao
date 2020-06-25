import jwt from "jsonwebtoken"
import CONSTANT from "../configs/constant"

class JwtHelper {
  /** JWT only token */
  jwtMethod(userObject,expireIn) {
    return jwt.sign(userObject, process.env.SECRET_KEY, {
      expiresIn: expireIn
    });
  }

  /** JWT with passport */
  jwtMethodWithPassport(userObject,expireIn) {
    return jwt.sign(userObject, CONSTANT.PRIVATE_KEY, {
      expiresIn: expireIn,algorithm:CONSTANT.JWT_ALGORITHMS
    });
  }
}

export default new JwtHelper();
