<template>
  <div class="loading-indicator"><span>Loading...</span></div>
</template>

<style scoped>
.loading-indicator {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: var(--color-accent);
  background-color: var(--color-underlayer);
}
.loading-indicator > span {
  width: 100%;
  text-align: center;
  font-weight: 600;
  transform: scale(0.5);
  animation: loading-indicator-animate 1s ease infinite alternate;
  font-size: 1rem;
}
@keyframes loading-indicator-animate {
  0% {
    transform: scale(0.75);
  }
  100% {
    transform: scale(1);
  }
}
</style>
