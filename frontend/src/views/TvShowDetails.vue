<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
console.log('route:', route.params)
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{ route.params.id }}</p>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
