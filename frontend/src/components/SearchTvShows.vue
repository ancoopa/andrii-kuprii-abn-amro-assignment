<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchTvShows } from '@/services/networking.service'
import { debounce } from '@/utils/debounce'
import type { TvShow } from '@/types/tv-show.types'
import useDetectOutsideClick from '@/composables/use-detect-outside-click'
import LoadingIndicator from './LoadingIndicator.vue'

const componentRef = ref()
const q = ref<string>('')
const searchResults = ref<TvShow[]>([])
const isDropdownVisible = ref<boolean>(false)
const isLoading = ref<boolean>(false)

function resetSearch() {
  searchResults.value = []
  q.value = ''
  isDropdownVisible.value = false
}

watch(
  q,
  debounce(async () => {
    if (q.value === '') {
      return resetSearch()
    }
    try {
      isLoading.value = true
      isDropdownVisible.value = true
      const response = await searchTvShows(q.value)
      searchResults.value = response.map((x) => x.show)
      isLoading.value = false
    } catch (err) {
      console.log(err)
    }
  })
)

useDetectOutsideClick(componentRef, () => {
  isDropdownVisible.value = false
})

function onInputFocus() {
  if (q.value.length > 0) {
    isDropdownVisible.value = true
  }
}
</script>

<template>
  <div ref="componentRef" class="search-wrapper">
    <div class="search">
      <label for="search">Search:</label>
      <input
        @focus="onInputFocus()"
        v-model="q"
        id="search"
        type="text"
        placeholder="Type Show Name Here..."
      />
    </div>
    <div class="dropdown">
      <ul v-if="isDropdownVisible" class="options-wrapper">
        <li v-if="isLoading" class="loading-indicator"><LoadingIndicator /></li>
        <li v-for="tvShow of searchResults" :key="tvShow.id">
          <RouterLink @click="resetSearch()" :to="`/show/${tvShow.id}`" class="option">
            <img
              v-if="tvShow?.image?.medium"
              class="option-image"
              :src="tvShow.image.medium"
              :alt="tvShow.name"
            />
            <img
              v-else
              class="option-image"
              src="@/assets/movie-placeholder.webp"
              :alt="tvShow.name"
            />

            <div class="option-title">{{ tvShow.name }}</div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 var(--spacer);
}
.search {
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--color-accent);
}
.search label {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.25px;
  padding: 0 0.25rem;
}
.search input {
  border: none;
  background-color: var(--color-ungerlayer);
  padding: 1rem var(--spacer);
  color: var(--color-text);
  width: 100%;
}
.search input::placeholder {
  color: var(--color-neutral);
  opacity: 1; /* Firefox */
}

.dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
}
.options-wrapper {
  position: absolute;
  z-index: 10;
  width: 100%;
  background-color: var(--color-underlayer);
  box-shadow: var(--box-shadow);
  padding: var(--spacer);
  border: 2px solid var(--color-background);
  border-top: none;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
.option {
  display: flex;
  padding: var(--spacer);
  height: 4rem;
  color: var(--color-text);
}
.option:hover {
  background-color: var(--color-background);
  color: var(--color-accent);
}
.option-title {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: var(--spacer) calc(var(--spacer) * 2);
  align-self: center;
  width: 100%;
}
.option-image {
  object-fit: cover;
  aspect-ratio: 9 / 16;
}

.loading-indicator {
  padding: calc(var(--spacer) * 2);
}

@media (min-width: 512px) {
  .search-wrapper {
    width: auto;
  }
  .search input {
    padding: var(--spacer);
    width: 10rem;
  }
}
</style>
