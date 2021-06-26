import JWT from "jsonwebtoken";
import { Op } from "sequelize";

import { InvalidAuthorizationHeader } from "../error";
import { jwtConfig } from "../config";
import { middlewareDebugger } from "../logger";
import UserToken from "../models/userToken";

const authorizationRegex = /^Bearer\b/;

const requireUserLogin = async (ctx, next) => {
  const authorization = ctx.request.header.authorization;
  middlewareDebugger("authorization = ", authorization);
  // 1. regex test Authorization
  if (!authorizationRegex.test(authorization)) {
    throw new InvalidAuthorizationHeader();
  }

  const jwt = authorization.substring(7);

  // 3. verify jwt
  const payload = JWT.verify(jwt, jwtConfig.JWT_PRIVATE_KEY);
  middlewareDebugger(payload);

  // 4. verify token
  const token = payload.token;
  const userToken = await UserToken.findOne({
    where: {
      token,
      userId: payload.currentUser.id,
      deletedAt: { [Op.eq]: null },
    },
  });
  if (userToken == null) {
    middlewareDebugger("InvalidAuthorizationHeader");
    throw new InvalidAuthorizationHeader();
  }

  // 5. add payload to state
  ctx.state = payload;

  await next(); // to the next layer
};

export { requireUserLogin };
