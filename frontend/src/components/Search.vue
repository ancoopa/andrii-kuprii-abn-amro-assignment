<script setup lang="ts">
  
</script>

<template>
<div class="search">
  <label for="search">Search:</label>
  <input
    id="search"
    type="text"
    placeholder="Type Show Name Here..."
  />
</div>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--color-accent);
}
.search label {
  text-transform: uppercase;
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: 0.25px;
  padding: 0 .25rem;
}
.search input {
  border: none;
  background-color: var(--color-ungerlayer);
  padding: 1rem var(--spacer);
  color: var(--color-text);
  width: 10rem;
}
.search input::placeholder {
  color: var(--color-neutral);
  opacity: 1; /* Firefox */
}
@media (min-width: 512px) {
  .search input {
    padding: var(--spacer);
  }
}
</style>