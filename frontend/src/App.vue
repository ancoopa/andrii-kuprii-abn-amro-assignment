<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { fetchPaginateTvShows } from '@/services/networking.service';
import { type TvShow } from '@/types/tv-show.types'
import { tvShowsKey, fetchNewPageKey } from '@/constants/provide-inject.keys';
import Loader from '@/components/Loader.vue'

export interface TvShowsState {
  [genre: string]: {
    shows: TvShow[],
    currentPage: number,
    hasMorePages: boolean,
  }
}

const parsedTvShows = ref<TvShowsState>({})
const isLoading = ref<boolean>(false)
provide(tvShowsKey, parsedTvShows)
provide(fetchNewPageKey, fetchSetNewPage)

async function fetchSetNewPage(genre: string): Promise<boolean> {  
  const genreState = parsedTvShows.value[genre]
  if (genreState.hasMorePages) {
    try {
      const newShowsPages = await fetchPaginateTvShows({
        page: genreState.currentPage + 1,
        genres: [genre],
      })
      const newPage = newShowsPages[genre]
      genreState.shows.push(...newPage.shows)
      genreState.currentPage = newPage.currentPage
      genreState.hasMorePages = newPage.hasMorePages
    } catch (err) {
      console.log(err)
    }
  }
  return genreState.hasMorePages
}

async function fetchSetFrashPageTvShows() {
  isLoading.value = true
  try {
    const shows = await fetchPaginateTvShows()
    parsedTvShows.value = shows
  } catch (err) {
    console.log(err)
  }
  isLoading.value = false
}

onMounted(async () => {
  await fetchSetFrashPageTvShows()
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
      </nav>
    </div>
  </header>

  <Loader v-if="isLoading" />
  <router-view v-esle v-slot="{ Component: RouterView }">
    <keep-alive>
      <component :is="RouterView" />
    </keep-alive>
  </router-view>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
