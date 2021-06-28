import Joi from 'joi'

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ['com', 'net', 'ie'] },
})

const nickname = Joi.string().alphanum().min(3).max(32)

const password = Joi.string().pattern(/^[a-zA-Z0-9_]{8,32}$/)

const topic = Joi.string().min(1).max(128)

const content = Joi.string().min(1)

const tag = Joi.string().alphanum().min(1).max(32)

const token = Joi.string().allow(null)

export { email, nickname, password, topic, content, tag, token }
