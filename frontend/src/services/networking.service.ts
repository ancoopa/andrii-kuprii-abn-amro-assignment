import { type TvShowsState } from '@/App.vue'
import { CACHE_API_URL, CACHE_API_SHOWS_ENDPOINT } from '@/constants/config'

export interface FetchTvShowsParams {
  genres?: string[];
  page?: number;
}

export async function fetchPaginateTvShows(params: FetchTvShowsParams = {}): Promise<TvShowsState> {
  const genres = params.genres || ''
  const page = params.page || 0
  const response = await fetch(`${CACHE_API_URL}${CACHE_API_SHOWS_ENDPOINT}?genres=${genres}&page=${page}`)
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
