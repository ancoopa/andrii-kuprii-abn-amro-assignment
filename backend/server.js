import express from 'express'
import { CacheManager } from './data-layer/cache-manager.js'

const app = express()
const port = 3000

// Caching TV shows before server start:
const cacheManager = new CacheManager()

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
  console.log(`Example app listening on port ${port}`)
})
