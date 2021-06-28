import Koa from 'koa'
import logger from 'koa-logger'
import cors from '@koa/cors'
import bodyParser from 'koa-body'

import router from './router'
import { errorHandler } from './middlewares/errorHandler'

const app = new Koa()

// common middlewares

app.use(logger()) // logger should be on the top

app.use(errorHandler) // try to catch errors

app.use(
  cors({
    origin: '*',
    credentials: true,
    allowHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    keepHeadersOnError: true,
  })
)

app.use(bodyParser())

// router
app.use(router.routes())

app.listen(3000)
