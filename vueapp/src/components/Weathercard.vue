<template>
    <div :class="['card', { dark: darkMode}]">
        <div class="card-header">
            <span>Weather</span>
                <button class="close-btn" @click="$emit('close')">✖</button>
                </div>
        <input v-model="city" placeholder="Enter City name"/>
        <h1 v-if="weather">{{ weatherIcons[weather.weathercode] || '🌡️' }}</h1>
        <button @click="fetchWeather"> {{ loading ? 'Fetching...' : 'Get Weather' }} </button>
        <button class="secondary" @click="detectLocation">📍 Use my location</button>
        <p v-if="error" class="error">{{ error }}</p>
        <select v-if="countries.length > 1" v-model = "selectedCountry"  @change="selectCountry">
        <option disabled value="">Select country</option>
        <option v-for="loc in locations"  :key="`${loc.latitude}-${loc.longitude}`" :value="loc">
        {{ loc.name }}, {{ loc.admin1 || '' }}, {{ loc.country }} </option>
    </select>
        <div v-if="weather">
            <h2>{{ location }}</h2>
            <p class="temp"> Temperature: {{ weather.temperature }} °C</p>
            <p> Wind Speed: {{ weather.windspeed }} km/h</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getCoordinates, getWeather} from '../services/weatherService'
const city = ref('')
const weather = ref(null)
const location = ref('')
const locations = ref([])
const countries = ref([])
const selectedCountry = ref(null)
const error = ref('')
const loading = ref(false)
const weatherIcons = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  61: '🌧️',
  71: '❄️'
}


async function fetchWeather() {  
    error.value = ''
    weather.value = null
    locations.value = []
    countries.value = []
    selectedCountry.value = ''
    location.value = ''

    if (!city.value.trim()) {
        error.value = 'Please enter a city name'
        return
    }
    loading.value = true
    //try {
        //loading.value = true
    const coords = await getCoordinates(city.value)
    if(!coords.length) {
        error.value = 'City not found'
        loading.value = false
        return
    }
    locations.value = coords
    //location.value = `${coords.name}, ${coords.country}`

    countries.value = [
        ...new Set(coords.map(loc => loc.country))
    ]

    if (countries.value.length === 1){
        selectedCountry.value = locations.value[0]
        await selectCountry()
        //selectedCountry(countries.value[0])
        loading.value = false
        return
    }
    loading.value = false   
}


async function selectCountry(country) {
    const loc = selectedCountry.value
    //const loc = locations.value.find(
       // l => l.country === country
    //)
    if (!loc) return
    location.value = `${loc.name}, ${loc.admin1 || ''}, ${loc.country}`
    loading.value = true
    const data = await getWeather(loc.latitude, loc.longitude)
    loading.value = false

    if (!data || !data.current_weather) {
    error.value = 'Weather data unavailable'
    return
  }
    weather.value = data.current_weather
}

function detectLocation() {
  if (!navigator.geolocation) {
    error.value = 'Geolocation not supported'
    return
  }

  loading.value = true

  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords
    const data = await getWeather(latitude, longitude)
    loading.value = false

    weather.value = data.current_weather
    location.value = 'Your current location'
  })
}
//watch(darkMode, val => {
  //document.body.classList.toggle('dark', val)
//})

const props = defineProps({
    darkMode: Boolean
})
const emit = defineEmits(['close'])

</script>


<style scoped>
.card {
    background: rgba(255, 255, 255, 0.95);
    position: relative;
    top: 80px;
    right: 24px;
    z-index: 999;
    backdrop-filter: blur(10px);
    padding: 28px 24px 24px;
    border-radius: 16px;
    width: 100%;
    max-width: 360px;
    text-align: center;
    animation: slideIn 0.25s ease;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}
.card-header{
    border: none;
    background: transparent;
    font-size: 18px;
    cursor: pointer;
}
.card.dark {
    background: rgba(30, 30, 30, 0.95);
    color: #f1f1f1;
}
.card.dark input,
.card.dark select {
    background: #222;
    color: white;
    border-color: #444;
}
.card.dark button{
    background: #4f46e5;
}
@keyframes slideIn{
    from {
        transform: translate(-10px);
        opacity: 0;
    }
    to{
        transform: translateY(0);
        opacity: 1;
    }
}
.card.dark .secondary{
    background: transparent;
    border-color: #666;
}
input{
    padding: 8px;
    width: 100%;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    outline: none;
    font-size: 14px;
}
input:focus{
    border-color: #6c63ff;
}
button{
    margin-top: 12px;
    width: 100%;
    border: none;
    border-radius: 10px;
    padding: 12px;
    background: #6366ff;
    color: white;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
}
button:hover{
    background: #574fd6;
}
input,
select, 
button{
    min-height: 44px;
}
@media (max-width: 480px){
    .card {
        padding: 18px;
    }
}
.error{
    color: red;
    margin-top: 10px;
    font-size: 14px;
}
h2{
    margin-top: 16px;
    font-size: 18px;
}
p{
    margin: 6px 0;
    font-size: 14px;
}
.loading{
    opacity: 0.7;
    font-style: italic;
}
.secondary{
    background: transparent;
    color: inherit;
    border: 1px solid #ccc;
}
.close-btn{
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 10px;
    background: #6366f1;
    font-size: 18px;
    color: white;
    cursor: pointer;
    z-index: 10;
}
.close-btn:hover{
    background: #4f46e5;
}
</style>