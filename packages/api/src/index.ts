import * as express from 'express'

const port = 3000

const app: express.Express = express()

const router: express.Router = express.Router()

router.get('/', (req: express.Request, res: express.Response) => {
  console.log(' ***** headers ***** ')
  console.log(req.headers)
  res.send('this is app server!!')
})

app.use(router)

app.listen(port, () => {
  console.log('Example app listening on port 3000!')
})
