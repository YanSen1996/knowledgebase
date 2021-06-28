import Joi, { ValidationError } from 'joi'
import { Op } from 'sequelize'
import _ from 'lodash'

import { topic, tag, content } from '../constants/validation'
import Document from '../models/document'
import { NoDocument, DocNotBelongToUser } from '../error'

const docStructure = i => {
  return {
    id: i.id,
    topic: i.topic,
    content: i.content,
    tags: i.tags,
    createdAt: i.createdAt,
  }
}

// docCreate handles document creation
const docCreate = async (ctx, next) => {
  // 1. validation
  const user = ctx.state.currentUser
  const { value, error } = await docSchema.validate(ctx.request.body)
  if (error instanceof ValidationError) {
    throw error
  }

  // 2. model creation
  const res = await Document.create({
    ...value,
    userId: user.id,
  })

  // 3. response
  ctx.body = {
    message: 'OK',
    data: docStructure(res),
  }
}

// docModify handles document modification
const docModify = async (ctx, next) => {
  // 1. check if document belongs to user
  const user = ctx.state.currentUser
  const doc = await Document.findOne({
    where: { id: ctx.params.id, deletedAt: { [Op.eq]: null } },
  })

  if (doc == null) {
    throw new NoDocument()
  }

  if (doc.userId !== user.id) {
    throw new DocNotBelongToUser()
  }

  // 2. validate
  const { value, error } = await docSchema.validate(ctx.request.body)
  if (error instanceof ValidationError) {
    throw error
  }

  // 3. modify document content
  await Document.update(value, {
    where: {
      id: doc.id,
    },
  })
  ctx.body = {
    messgae: 'OK',
    data: docStructure(await Document.findOne({ where: { id: doc.id } })),
  }
}

// docRemove handles document removal
const docRemove = async (ctx, next) => {
  // 1. check if document belongs to user
  const user = ctx.state.currentUser
  const doc = await Document.findOne({
    where: { id: ctx.params.id, deletedAt: { [Op.eq]: null } },
  })

  if (doc === null) {
    throw new NoDocument()
  }

  if (doc.userId !== user.id) {
    throw new DocNotBelongToUser()
  }

  // 2.remove
  await Document.update(
    { deletedAt: new Date() },
    {
      where: {
        id: doc.id,
      },
    }
  )
  ctx.body = {
    message: 'OK',
  }
}

// docView provides document details
const docView = async (ctx, next) => {
  // 1. check if document belongs to user
  const user = ctx.state.currentUser
  const doc = await Document.findOne({
    where: { id: ctx.params.id, deletedAt: { [Op.eq]: null } },
  })

  if (doc === null) {
    throw new NoDocument()
  }

  if (doc.userId !== user.id) {
    throw new DocNotBelongToUser()
  }

  // 2. provide document details
  ctx.body = {
    message: 'OK',
    data: docStructure(doc),
  }
}

// docList lists all documents of current user
const docList = async (ctx, next) => {
  const user = ctx.state.currentUser
  const docs = await Document.findAll({
    where: { userId: user.id, deletedAt: { [Op.eq]: null } },
  })
  if (docs === null) {
    ctx.body = {
      message: 'OK',
      data: "There's no document now. Why not to create one?",
    }
  } else {
    ctx.body = {
      message: 'OK',
      data: _.map(docs, docStructure),
    }
  }
}

const docSchema = Joi.object({
  topic: topic.required(),
  content: content.required(),
  tags: Joi.array().items(tag).unique().required(),
})

export { docCreate, docModify, docRemove, docView, docList }
