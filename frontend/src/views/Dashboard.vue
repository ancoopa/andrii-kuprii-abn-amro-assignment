<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import TvShowsList from '../components/TvShowsList.vue'
import type { TvShowsState } from '@/App.vue';
import { tvShowsKey } from '@/keys'

const parsedTvShows: TvShowsState = inject(tvShowsKey, {})
const genres = ref<string[]>([])

onMounted(() => {
  genres.value = Object.keys(parsedTvShows.value).sort()
})

watch(parsedTvShows, () => {
  genres.value = Object.keys(parsedTvShows.value).sort()
})

</script>

<template>
  <main>
    <section class="section" v-if="genres.length > 0" v-for="genre in genres" :key="genre">
      <h1 class="title">{{ genre }}</h1>
      <TvShowsList v-if="parsedTvShows[genre]"
        :tvShows="parsedTvShows[genre].shows" />
    </section>
  </main>
</template>

<style scoped>
.section {
  padding-bottom: 2.25rem;
}

.title {
  padding: calc(var(--spacer) * 1.5) calc(var(--spacer) * 1.25);
  /* text-align: center; */
  background-color: var(--color-underlayer-transparent);
  box-shadow: var(--box-shadow);
}
</style>
