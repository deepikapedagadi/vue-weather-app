<script setup>
import { ref, watch, onMounted } from 'vue'
import Weathercard from './components/Weathercard.vue'

const darkMode = ref(false)
const showWeather = ref(false)
function toggleDark(){
  darkMode.value = !darkMode.value
}
watch(darkMode, val => {
  document.body.classList.toggle('dark', val)
  localStorage.setItem('theme', val ? 'dark' : 'light')
})
onMounted(() => {
  const saved = localStorage.getItem('theme')
  darkMode.value = saved 
  ? saved === 'dark'
  : window.matchMedia('(prefers-color-scheme: dark)').matches
})
</script>

<template>
  <div class="app">
    <header class="topbar">
      <h1>My Dashboard</h1>
    <div class="top-actions">
        <button class="icon-btn" @click="showWeather = !showWeather">🌤️</button>
        <button class="icon-btn" @click="toggleDark">
            {{  darkMode ? '☀️' : '🌙' }} </button>
        </div>
          <div class="popover" v-if="showWeather">
    <Weathercard 
    v-if="showWeather"
    :darkMode="darkMode"
    @close="showWeather = false"
     />
     </div>
    </header>
    <!--MAIN PAGE-->
        <main class="content">
          <!-- h1>My Dashboard</h1-->
          <p>More features coming here 🚀</p>
        </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  /* flex-direction: column;
  background: linear-gradient(135deg, #74ebd5, #9face6);
  align-items: center; */
  /* gap: 20px; */
  /* transition: background 0.4s ease; */
}
.topbar {
  position: relative; /* anchor */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
}
.top-actions{
  top: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}
.icon-btn{
  background: rgba(255, 255, 255, 0.8);
  font-size: 20px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
.popover{
  position: absolute;
  top: 60px;
  right: 0;
  z-index: 1000;
}
.content{
  min-height: 100vh;
  display: grid;
  place-content: center;
  text-align: center;
}
h1 {
  margin-bottom: 20px;
  color: #222;
}
</style>
