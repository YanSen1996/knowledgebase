import { ValidationError } from "joi";

import {
  UserLogInEmailPasswordNotFound,
  UserAlreadyLoggedIn,
  NoDocument,
  DocNotBelongToUser,
  TokenExpiredError,
  InvalidAuthorizationHeader,
  EmailRegistered,
} from "../error";
import { middlewareDebugger as debug } from "../logger";

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    debug(err.message);
    switch (err.constructor) {
      case DocNotBelongToUser:
        ctx.status = 401;
        ctx.body = {
          message: err.message,
        };
        break;
      case TokenExpiredError:
      case InvalidAuthorizationHeader:
      case ValidationError:
      case NoDocument:
      case UserAlreadyLoggedIn:
      case EmailRegistered:
      case UserLogInEmailPasswordNotFound:
        ctx.status = 400;
        ctx.body = {
          message: err.message,
        };
        break;
      default:
        ctx.status = 400;
        ctx.body = {
          message: "Error",
        };
    }
  }
};

export { errorHandler };
