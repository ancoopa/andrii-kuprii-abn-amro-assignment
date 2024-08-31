import { type TvShowsState } from './App.vue'
const SHOWS_CACHE_API_URL = 'http://localhost:3000'

export interface FetchTvShowsParams {
  genres?: string[];
  page?: number;
}

export async function fetchPaginateTvShows(params: FetchTvShowsParams = {}): Promise<TvShowsState> {
  const genres = params.genres || ''
  const page = params.page || 0
  const response = await fetch(`${SHOWS_CACHE_API_URL}/shows?genres=${genres}&page=${page}`)
  const shows = await response.json()
  
  // Populate with pagination data
  const result: TvShowsState = {}
  for (let genre of Object.keys(shows)) {
    result[genre] = {
      currentPage: page,
      shows: shows[genre],
      hasMorePages: shows[genre].length > 0,
    }
  }
  return result
}
