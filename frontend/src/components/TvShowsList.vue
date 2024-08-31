<script setup lang="ts">
import { type TvShow } from '../shared-types'

const props = defineProps<{
  tvShows: TvShow[];
}>()
</script>

<template>
  <ul role="list" class="media-scroller" v-if="props.tvShows"> 
    <li role="listitem" class="media-element" v-for="show in props.tvShows" :key="show.id">
      
      <img class="image" v-if="show?.image?.medium" :src="show.image.medium" :alt="show.name" />
      <img class="image" v-else src="@/assets/movie-placeholder.webp" :alt="show.name" />
      
      <h2 class="title">{{ show.name }}</h2>
      <span v-if="show.rating.average" class="rating">{{ `★${show.rating.average}` }}</span>
      <RouterLink :to="'/show/' + show.id"><button class="button">Details</button></RouterLink>
    </li>
  </ul>
  <ul v-else="props.tvShows">
    Loading...
  </ul>
</template>

<style scoped>
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
