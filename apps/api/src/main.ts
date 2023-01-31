import 'reflect-metadata'
import express, { Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import cors from 'cors'

import { appDataSource } from './data-source'
import { appRoutes } from './routes'

appDataSource
  .initialize()
  .then(() => {
    const app = express()

    app.use(bodyParser.json())
    app.use(cors())

    appRoutes.forEach((route) => {
      app[route.method](
        route.path,
        (request: Request, response: Response, next: (arg: unknown) => void) => {
          route
            .action(request, response)
            .then(() => next)
            .catch((err) => next(err))
        },
      )
    })

    const port = process.env.PORT || 3333

    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`)
    })

    server.on('error', console.error)
  })
  .catch(console.log)
