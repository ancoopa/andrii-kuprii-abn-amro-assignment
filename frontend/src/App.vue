<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Search from '@/components/Search.vue'
</script>

<template>
  <header>
    <nav>
      <ul class="nav-links">
        <li><RouterLink to="/">Dashboard</RouterLink></li>
      </ul>
      <Search />
    </nav>
  </header>

  <!-- TODO: Probably there is a nicer way to keep alive routes -->
  <router-view v-slot="{ Component: RouterView }">
    <keep-alive>
      <component :is="RouterView" />
    </keep-alive>
  </router-view>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: var(--spacer);
  background-color: var(--color-underlayer);
  border-bottom: 1px solid var(--color-background);
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}
nav a {
  display: inline-block;
  padding: 1.5rem 1rem 1rem;
  border-left: 1px solid var(--color-unredlayer);
}
nav a:first-of-type {
  border: 0;
}


@media (min-width: 512px) {
  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: .75rem 0;
  }
  nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-unredlayer);
  }
  .search input {
    padding: var(--spacer);
  }
}
</style>
