import express from 'express'
import Chance from 'chance'
let chance = new Chance()
import { handler } from './build/handler.js'

import http from 'http';

const app = express()
const server = http.createServer(app);

import injectSocketIO from "./socketIOServer.js"
injectSocketIO(server)

app.use(handler)

const port = 3000

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
