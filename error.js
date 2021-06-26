class UserLogInEmailPasswordNotFound extends Error {
  constructor() {
    super("Email or password is not valid");
  }
}

class UserAlreadyLoggedIn extends Error {
  constructor() {
    super("User already logged in");
  }
}

class NoDocument extends Error {
  constructor() {
    super("No such document");
  }
}

class DocNotBelongToUser extends Error {
  constructor() {
    super("You're NOT supposed to do that");
  }
}

class TokenExpiredError extends Error {
  constructor() {
    super("Your token is expired");
  }
}

class InvalidAuthorizationHeader extends Error {
  constructor() {
    super("Invalid Authorization Header");
  }
}

class EmailRegistered extends Error {
  constructor() {
    super("Email already registered U IDIOT");
  }
}

export {
  UserLogInEmailPasswordNotFound,
  UserAlreadyLoggedIn,
  NoDocument,
  DocNotBelongToUser,
  TokenExpiredError,
  InvalidAuthorizationHeader,
  EmailRegistered,
};
