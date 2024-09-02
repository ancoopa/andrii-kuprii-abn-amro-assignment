<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type TvShow } from '@/types/tv-show.types'
import { fetchTvShow } from '@/services/networking.service'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import { stripHtml } from '@/utils/strip-html'

const tvShow = ref<TvShow | null>(null)
const isLoading = ref<boolean>(false)
const route = useRoute()

async function fetchSetTvShow() {
  const id = parseInt(route.params.id as string)
  if (isNaN(id)) {
    return null
  }
  isLoading.value = true
  try {
    const show = await fetchTvShow(id)
    if (show !== null) {
      tvShow.value = show
    }
  } catch (err) {
    console.log(err)
  }
  isLoading.value = false
}

onMounted(async () => {
  await fetchSetTvShow()
})
watch(
  () => route.params.id,
  async () => {
    await fetchSetTvShow()
  }
)
</script>

<template>
  <LoadingIndicator v-if="isLoading" />
  <article v-else-if="tvShow" class="tv-show">
    <img
      v-if="tvShow.image?.original"
      class="tv-show-image"
      :src="tvShow.image?.original"
      :alt="tvShow.name"
    />
    <img v-else class="tv-show-image" src="@/assets/movie-placeholder.webp" :alt="tvShow.name" />

    <div class="tv-show-info">
      <h1 class="title">{{ tvShow.name }}</h1>
      <div class="stats">
        <ul class="genres">
          <li v-for="genre in tvShow.genres" :key="genre">
            {{ genre }}
          </li>
        </ul>
        <div v-if="tvShow.rating.average" class="rating">
          Rating: {{ `★${tvShow.rating.average}` }}
        </div>
        <div>Premiered: {{ tvShow.premiered }}</div>
        <div>Language: {{ tvShow.language }}</div>
        <div>Status: {{ tvShow.status }}</div>
        <div class="summary">{{ stripHtml(tvShow.summary) }}</div>
      </div>
      <a v-if="tvShow.officialSite" :href="tvShow.officialSite">
        <button class="button button-secondary">Official Site</button>
      </a>
      <a :href="tvShow.url">
        <button class="button">On Tvmaze</button>
      </a>
    </div>
  </article>
  <div v-else>No show with id {{ route.params.id }}.</div>
</template>

<style scoped>
.tv-show {
  display: block;
  position: relative;
  min-height: 100vh;
  background-color: var(--color-underlayer);
  border-radius: var(--border-radius);
  overflow: hidden;
  z-index: 1;
}
.tv-show-image {
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius);
}
.tv-show-info {
  background-color: var(--color-underlayer-transparent);
  width: 100%;
  min-height: 100vh;
  padding: var(--spacer) calc(var(--spacer) * 2);
  z-index: 3;
}

@media (min-width: 678px) {
  .tv-show {
    display: grid;
    grid-template-columns: 55% 45%;
    width: 90vw;
    min-height: auto;
    margin: 2.5vw auto;
  }
  .tv-show-info {
    min-height: auto;
  }
  .tv-show-image {
    position: inherit;
    height: auto;
  }
}

.stats {
  font-size: 0.8rem;
  padding-top: var(--spacer);
}
.stats .title {
  color: var(--color-accent);
}

.stats .genres {
  display: inline;
  color: var(--color-neutral);
  font-weight: 600;
}
.stats .genres > li {
  display: inline;
}
.stats .genres > li::after {
  content: ', ';
}
.stats .genres > li:last-child::after {
  content: '.';
}

.stats .rating {
  color: var(--color-accent);
}
.stats .summary {
  text-align: justify;
  padding: var(--spacer) 0;
}

.button {
  padding: var(--spacer) calc(var(--spacer) * 1.5);
  background-color: var(--color-accent);
  font-weight: 600;
  border: 1px solid var(--color-accent);
  border-radius: var(--border-radius);
  cursor: pointer;
  margin: 0 var(--spacer) calc(var(--spacer) * 2) 0;
}
.button-secondary {
  background-color: transparent;
  color: var(--color-accent);
}
</style>
