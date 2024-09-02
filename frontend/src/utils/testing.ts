import type { TvShow } from '@/types/tv-show.types'
import singleTvShowData from '@/utils/single-show-data-sample.json'

export function generateTvShows(quantity: number): TvShow[] {
  const result: TvShow[] = []
  for (let i = 0; i < quantity; i++) {
    result.push({
      ...singleTvShowData,
      id: i,
      name: `${singleTvShowData.name}${i}`
    })
  }
  return result
}
