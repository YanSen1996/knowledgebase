import Joi, { ValidationError } from 'joi'
import { Op } from 'sequelize'
import _ from 'lodash'

import { topic, tag, content } from '../constants/validation'
import Document from '../models/document'
import { NoDocument, DocNotBelongToUser } from '../error'

// docCreate handles document creation
const docCreate = async (ctx, next) => {
  // 1. validation
  const { value, error } = await docSchema.validate(ctx.request.body)
  if (error instanceof ValidationError) {
    throw error
  }

  // 2. model creation
  const user = ctx.state.currentUser
  await Document.create({
    ...value,
    userId: user.id,
  })

  // 3. response
  ctx.body = {
    message: 'OK',
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
    throw new NoTodoItem()
  }

  if (doc.userId !== user.id) {
    throw new ItemNotBelongToUser()
  }

  // 2. validate
  const { value, error } = await docSchema.validate(ctx.request.body)
  if (error instanceof ValidationError) {
    throw error
  }

  // 3. modify document content
  await Todo.update(value, {
    where: {
      id: doc.id,
    },
  })
  ctx.body = {
    messgae: 'OK',
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

  if (item === null) {
    throw new NoDocument()
  }

  if (item.userId !== user.id) {
    throw new DocNotBelongToUser()
  }

  // 2. provide document details
  ctx.body = {
    message: 'OK',
    data: {
      id: doc.id,
      topic: doc.topic,
      content: doc.content,
      tags: doc.tags,
      createdAt: doc.createdAt,
    },
  }
}

// docList lists all documents of current user
const docList = async (ctx, next) => {
  const user = ctx.state.currentUser
  const docs = await Todo.findAll({
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
      data: _.map(docs, i => {
        return {
          id: i.id,
          topic: i.topic,
          content: i.content,
          createdAt: i.createdAt,
          tags: i.tags,
        }
      }),
    }
  }
}

const docSchema = Joi.object({
  topic: topic.required(),
  content: content,
  tags: Joi.array().items(tag).unique().required(),
})

export { docCreate, docModify, docRemove, docView, docList }
