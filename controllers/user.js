import Joi, { ValidationError } from 'joi'
import { Op, UniqueConstraintError } from 'sequelize'
import md5 from 'md5'
import JWT from 'jsonwebtoken'

import { controllerDebugger } from '../logger'
import User from '../models/user'
import PasswordResetToken from '../models/passwordResetToken'
import UserToken from '../models/userToken'
import {
  email,
  nickname,
  password,
  token as tokenValidator,
} from '../constants/validation'
import {
  UserLogInEmailPasswordNotFound,
  UserAlreadyLoggedIn,
  TokenExpiredError,
  EmailRegistered,
} from '../error'
import { jwtConfig, MD5_SALT } from '../config'

const debug = controllerDebugger('user')

// userRegister handles user registration
const userRegister = async (ctx, next) => {
  // 1. validation
  const { value, error } = await userRegisterSchema.validate(ctx.request.body)
  if (error instanceof ValidationError) {
    throw error
  }

  // 2. model creation
  let user
  try {
    user = await User.create({
      ...value,
      password: md5(value.password + MD5_SALT),
    })
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new EmailRegistered()
    }
    throw err
  }
  // 3. response
  // ctx.status = 200
  ctx.body = {
    message: 'OK',
    data: user.email,
  }
}

const userLogIn = async (ctx, next) => {
  // 0. if user already logged in
  debug('ctx.request.header.authorization = ', ctx.request.header.authorization)
  if (ctx.request.header.authorization != null) {
    throw new UserAlreadyLoggedIn()
  }

  // 1. validation
  const { value, error } = await userLogInSchema.validate(ctx.request.body)
  if (error instanceof ValidationError) {
    throw error
  }

  // 2. search by email and password
  let user = await User.findOne({
    where: { ...value, password: md5(value.password + MD5_SALT) },
  })
  if (user == null) {
    throw new UserLogInEmailPasswordNotFound()
  }

  // 3. update last login
  user = await user.update({ lastLogin: new Date() })

  // 4. create token
  // before that mark all tokens deleted
  await UserToken.update(
    {
      deletedAt: new Date(),
    },
    {
      where: {
        userId: user.id,
      },
    }
  )
  const userTokenStr = md5(MD5_SALT + user.id + Date.now()) // TODO should not use the smae salt but emmmm
  await UserToken.create({
    token: userTokenStr,
    userId: user.id,
  })

  // 5. create jwt
  const jwt = JWT.sign(
    { currentUser: user, token: userTokenStr },
    jwtConfig.JWT_PRIVATE_KEY,
    {
      expiresIn: jwtConfig.JWT_TTL,
    }
  )
  // 6. response
  ctx.body = {
    message: 'OK',
    data: jwt,
  }
}

const userLogOut = async (ctx, next) => {
  // 1. mark all tokens as deleted
  await UserToken.update(
    {
      deletedAt: new Date(),
    },
    {
      where: {
        userId: ctx.state.currentUser.id,
      },
    }
  )

  // 2. clear state
  ctx.state.currentUser = null
  ctx.state.token = null

  ctx.body = {
    message: 'User logged out',
  }
}

// passwordForgotten sends email to user
const passwordForgotten = async (ctx, next) => {
  // 1. validation
  const { value, error } = await passwordForgottonSchema.validate(
    ctx.request.body
  )
  if (error instanceof ValidationError) {
    throw error
  }

  // 2. model creation
  await PasswordResetToken.create({
    ...value,
    token: md5(Date.now().toString() + MD5_SALT),
    dueAt: Date.now() + 30 * 60 * 1000,
    deletedAt: null,
  })

  // TODO 3. SendGrid API

  // 4. response
  ctx.body = {
    messgae: 'OK',
    data:
      'An email has been sent to ' +
      value.email +
      ' and the link attached turns invalid at ' +
      Date(value.dueAt).toString(),
  }
}

// passwordReset resets user's password
const passwordReset = async (ctx, next) => {
  // 1. validate
  const { value, error } = await passwordResetSchema.validate(ctx.request.body)
  if (error instanceof ValidationError) {
    throw error
  }

  // 2. find token
  const { tokenError } = await tokenValidator.validate(ctx.request.token)
  if (tokenError instanceof ValidationError) {
    throw tokenError
  }
  const token = await PasswordResetToken.findOne({
    where: { token: ctx.params.token, deletedAt: { [Op.eq]: null } },
  })
  debug(token.toJSON())
  const user = await User.findOne({
    where: { email: token.email },
  })
  const currtenTime = Date.now()

  if (token.dueAt.getTime() <= currtenTime) {
    throw new TokenExpiredError()
  }

  // 3. reset password
  await user.update({ password: md5(value.newPassword + MD5_SALT) })

  await token.update({ deletedAt: Date.now() })

  ctx.body = {
    message: 'OK',
  }
}

const userRegisterSchema = Joi.object({
  nickname: nickname.required(),
  email: email.required(),
  password: password.required(),
})

const userLogInSchema = Joi.object({
  email: email.required(),
  password: password.required(),
})

const passwordForgottonSchema = Joi.object({
  email: email.required(),
})

const passwordResetSchema = Joi.object({
  newPassword: password.required(),
})

export { userRegister, userLogIn, userLogOut, passwordForgotten, passwordReset }
