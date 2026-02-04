<script setup>
import Weathercard from './components/Weathercard.vue'
</script>

<template>
  <div class="app">
    <h1> Weather App</h1>
    <Weathercard />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #74ebd5, #9face6);
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #222;
}
</style>
