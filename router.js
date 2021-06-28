import Router from '@koa/router'

import {
  docCreate,
  docModify,
  docRemove,
  docView,
  docList,
} from './controllers/document'
import {
  userRegister,
  userLogIn,
  userLogOut,
  passwordForgotten,
  passwordReset,
} from './controllers/user'
import { requiredUserLogin } from './middlewares/userAuth'

const router = new Router()

// user api
router.post('/user/register', userRegister)
router.post('/user/login', userLogIn)
router.delete('/user/logout', requiredUserLogin, userLogOut)
router.post('/user/forgot_password', passwordForgotten)
router.post('/user/reset_password/:token', passwordReset)

// doc api
router.post('/doc', requiredUserLogin, docCreate)
router.post('/doc/:id', requireUserLogin, docModify)
router.delete('/doc/:id', requireUserLogin, docRemove)
router.get('/doc/:id', requireUserLogin, docView)
router.get('/doc', requireUserLogin, docList)

export default router
