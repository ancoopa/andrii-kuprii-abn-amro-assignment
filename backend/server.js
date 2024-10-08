import express from 'express'
import cors from 'cors'
import { CacheManager } from './data-layer/cache-manager.js'

const app = express()
const port = 3000

app.use(cors())

const cacheManager = new CacheManager()
// Caching TV shows before server start:
await cacheManager.setup()

app.get('/', (req, res) => {
  res.send('Please, don\'t take this server seriously. \n This is just a proof of concept.')
})

app.get('/shows', (req, res) => {
  // Process query params:
  const page = parseInt(req.query.page) || 0
  const genres = req.query.genres &&
    req.query.genres
      .split(',')
        .map(x => x.toLowerCase())
   
  const shows = cacheManager.getShows({ genres, page })
  res.json(shows)
})

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})
