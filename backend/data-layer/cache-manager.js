import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

/**
 * If we use `"type": "module"`, __dirname doesn't exist
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class CacheManager {
  #DB_FILE_PATH = path.resolve(__dirname, './dont-remove-me-cached-shows.json')
  #SHOWS_API_URL = 'https://api.tvmaze.com/shows'
  #PAGE_SIZE = 20
  #showsCache = {
    unknownGenre: []
  }

  constructor() {
    console.log('Checking DataBase. Please Stand By...')
    /**
     * The #DB_FILE_PATH file is required to save time on the server rerun.
     * When you start the server if the file isn't empty, then the server
     * will cache data from it. If the file has only "{}" in it, then data
     * will be fetched from the tvmaze API.
     */
    const previouslySavedData = this.#readDB()
    if (Object.keys(previouslySavedData).length === 0) {
      return this.#cacheAllShows()
    }
    this.#showsCache = previouslySavedData
  }

  /**
   * @param {
   *   genres: String[] | undefined
   *   page: number
   * } options
   * @returns 
   */
  getShows(options) {
    const { page } = options
    const genres = !options.genres || options.genres.length === 0
      ? Object.keys(this.#showsCache)
      : options.genres
    const firstIndex = page * this.#PAGE_SIZE
    const lastIndex = firstIndex + this.#PAGE_SIZE

    const result = {};
    for (let genre of genres) {
      const shows = this.#showsCache[genre]
      if (!shows) {
        continue
      }
      result[genre] = this.#showsCache[genre].slice(firstIndex, lastIndex)
    }
    return result;
  }

  #readDB() {
    const data = fs.readFileSync(this.#DB_FILE_PATH)
    return JSON.parse(data)
  }

  #writeDB() {
    fs.writeFileSync(this.#DB_FILE_PATH, JSON.stringify(this.#showsCache))
  }

  resetDB() {
    fs.writeFileSync(this.#DB_FILE_PATH, JSON.stringify({}))
  }

  async #cacheAllShows(pageNumber = 0) {
    console.log('Caching... Please wait until all shows will be cached.')
    const showsOnPage = await this.#fetchShowsByPage(pageNumber)
    if (showsOnPage.length > 0) {
      this.#saveShowsByGenre(showsOnPage)
      this.#printOngoingCachingStats()
      return this.#cacheAllShows(++pageNumber)
    }

    this.#sortShowsByRating()
    this.#writeDB()
    console.log('All shows cached and sorted!\nNow you can use the server.')
  }

  async #fetchShowsByPage(pageNumber) {
    try {
      const response = await fetch(`${this.#SHOWS_API_URL}?page=${pageNumber}`)
      return await response.json()
    } catch(err) {
      console.log('ERROR: ', err)
    }  
  }

  #saveShowsByGenre(shows) {
    for (let show of shows) {
      const genres = show.genres.map(x => x.toLowerCase())

      /**
       * Sometimes genre field is an empty array,
       * so we put such shows to the unknownGenre.
       */
      if (genres.length === 0) {
        this.#showsCache.unknownGenre.push(show)
      }

      for (let genre of genres) {
        if (!this.#showsCache[genre]) {
          this.#showsCache[genre] = []
        }
        this.#showsCache[genre].push(show)
      }
    }
  }

  #sortShowsByRating() {
    const genres = Object.keys(this.#showsCache)
    for (let genre of genres) {
      /**
       * IMPORTANT!
       * Please, be careful here. Direct object mutation happens
       * in order to avoid creating huge copies of arrays.
       */
      this.#showsCache[genre].sort((show1, show2) =>
        show2.rating.average - show1.rating.average)
    }
  }

  #printOngoingCachingStats() {
    console.log('Shows cached: ')
    const genres = Object.keys(this.#showsCache)
    for (let genre of genres) {
      console.log(`${genre}: ${this.#showsCache[genre].length}`)
    }
  }
}
