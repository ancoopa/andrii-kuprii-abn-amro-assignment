<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { type TvShow } from '@/types/tv-show.types'
import { fetchNewPageKey } from '@/constants/provide-inject.keys'
import Loader from '@/components/Loader.vue'

const props = defineProps<{
  tvShows: TvShow[];
  genre: string;
}>()

const fetchSetNewPage: (genre: string) => boolean = inject(fetchNewPageKey, () => true);
const isLoading = ref<boolean>(false)
const hasMorePages = ref<boolean>(true)

async function loadMoreTvShows() {
  isLoading.value = true
  hasMorePages.value = await fetchSetNewPage(props.genre)
}

watch(props.tvShows, () => {
  isLoading.value = false
})
</script>

<template>
  <h1 class="list-title">{{ genre }} <i>→</i></h1>
  <ul v-if="props.tvShows" role="list" class="media-scroller"> 
    <li
      v-for="show in props.tvShows"
      :key="show.id"
      class="media-element"
      role="listitem"
    >
      
      <img
        v-if="show?.image?.medium"
        class="image"
        :src="show.image.medium"
        :alt="show.name"
      />  
      <img
        v-else
        class="image"
        src="@/assets/movie-placeholder.webp"
        :alt="show.name"
      />
      
      <h2 class="title">{{ show.name }}</h2>
      <span v-if="show.rating.average" class="rating">
        {{ `★${show.rating.average}` }}
      </span>
      <RouterLink :to="'/show/' + show.id">
        <button class="button">Details</button>
      </RouterLink>
    </li>

    <li v-if="hasMorePages" role="listitem" class="media-element">
      <Loader v-if="isLoading" />
      <button
        v-else
        class="button button--load-more"
        @click="loadMoreTvShows"
      >
        →<br/>Load More
      </button>
    </li>

  </ul>
</template>

<style scoped>
.list-title {
  padding: calc(var(--spacer) * 1.5) calc(var(--spacer) * 1.25);
  background-color: var(--color-underlayer-transparent);
  box-shadow: var(--box-shadow);
}

.media-scroller {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 67%;
  column-gap: calc(var(--spacer) * 2);
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  padding: 0 var(--spacer) var(--spacer);
}

.media-element {
  display: grid;
  grid-template-rows: min-content;
  background-color: var(--color-darkest);
  border: 2px solid var(--color-underlayer);
  border-top: none;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  position: relative;
  margin-bottom: .25rem;
  box-shadow: var(--box-shadow);
}

.image {
  inline-size: 100%;
  object-fit: cover;
  aspect-ratio: 9 / 16;
}

.title {
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: linear-gradient(var(--color-underlayer-transparent) 35%, transparent);
  padding: var(--spacer) var(--spacer) 5rem;
}

.rating {
  position: absolute;
  bottom: calc(var(--spacer) * 6.25);
  right: 0;
  background-color: var(--color-underlayer-transparent);
  padding: var(--spacer);
  color: var(--color-accent);
  font-weight: 600;
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
}

.button {
  padding: calc(var(--spacer) * 2);
  margin: 0;
  width: 100%;
  color: var(--color-darkest);
  font-weight: 600;
  background-color: var(--color-accent);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  border: none;
  cursor: pointer;
}

.button--load-more {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  background-color: var(--color-underlayer);
  color: var(--color-accent);
  /* text-decoration: underline; */
}

@media (min-width: 512px) {
  .media-scroller {
    grid-auto-columns: 35%;
  }
  .title {
    font-size: 1rem;
  }
  .rating {
    font-size: .75rem;
  }
}

@media (min-width: 678px) {
  .media-scroller {
    grid-auto-columns: 21%;
  }
}

@media (min-width: 1024px) {
  .media-scroller {
    grid-auto-columns: 17%;
  }
}
</style>
