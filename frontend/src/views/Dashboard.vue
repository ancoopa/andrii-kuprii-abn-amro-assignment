<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import TvShowsList from '@/components/TvShowsList.vue'
import type { TvShowsState } from '@/App.vue';
import { tvShowsKey } from '@/constants/provide-inject.keys'

const parsedTvShows: TvShowsState = inject(tvShowsKey, {})
const genres = ref<string[]>([])

/**
 * TODO: I'm not too fond of the following part with the same thing
 * happening on onMounted() and watch(). There is probably a nicer
 * solution that I'm going to explore later.
 */
function setGenres() {
  genres.value = Object.keys(parsedTvShows.value).sort()
}
onMounted(() => {
  setGenres()
})
watch(parsedTvShows, () => {
  setGenres()
})
</script>

<template>
  <main>
    <section class="section" v-if="genres.length > 0" v-for="genre in genres" :key="genre">
      <TvShowsList v-if="parsedTvShows[genre]"
        :tvShows="parsedTvShows[genre].shows"
        :genre="genre"/>
    </section>
  </main>
</template>

<style scoped>
.section {
  padding-bottom: 2.25rem;
}
</style>
