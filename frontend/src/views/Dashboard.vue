<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import TvShowsList from '@/components/TvShowsList.vue'
import { fetchNewPageKey } from '@/constants/provide-inject.keys'
import type { TvShow } from '@/types/tv-show.types';
import { fetchPaginateTvShows } from '@/services/networking.service';
import Loader from '@/components/Loader.vue'

export interface TvShowsState {
  [genre: string]: {
    shows: TvShow[],
    currentPage: number,
    hasMorePages: boolean,
  }
}

const tvShows = ref<TvShowsState>({})
const genres = ref<string[]>([])
const isLoading = ref<boolean>(false)

provide(fetchNewPageKey, fetchSetNewPage)

async function fetchSetNewPage(genre: string): Promise<boolean> {  
  const genreState = tvShows.value[genre]
  if (genreState.hasMorePages) {
    try {
      const response = await fetchPaginateTvShows({
        page: genreState.currentPage + 1,
        genres: [genre],
      })
      const newPageData = response[genre]
      genreState.shows.push(...newPageData.shows)
      genreState.currentPage = newPageData.currentPage
      genreState.hasMorePages = newPageData.hasMorePages
    } catch (err) {
      console.log(err)
    }
  }
  return genreState.hasMorePages
}

async function fetchSetInitialData() {
  isLoading.value = true
  try {
    const shows = await fetchPaginateTvShows()
    tvShows.value = shows
    genres.value = Object.keys(tvShows.value).sort()
  } catch (err) {
    console.log(err)
  }
  isLoading.value = false
}

onMounted(async () => {
  await fetchSetInitialData()
})
</script>

<template>
  <Loader v-if="isLoading" />
  <main v-else>
    <section class="section" v-if="genres.length > 0" v-for="genre in genres" :key="genre">
      <TvShowsList v-if="tvShows[genre]"
        :tvShows="tvShows[genre].shows"
        :genre="genre"/>
    </section>
  </main>
</template>

<style scoped>
.section {
  padding-bottom: 2.25rem;
}
</style>
