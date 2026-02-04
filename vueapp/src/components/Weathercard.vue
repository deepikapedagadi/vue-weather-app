<template>
    <div class="card">
        <input
        v-model="city"
        placeholder="Enter City name"
        />
        <button @click="fetchWeather">Get Weather</button>
        <p v-if="loading">Loading...</p>
        <p v-if="error" class="error">{{ error }}</p>
        <select
            v-if="countries.length > 1"
            v-model = "selectedCountry"
            @change="selectCountry"
>
  <option disabled value="">Select country</option>
  <option
    v-for="loc in locations"
    :key="`${loc.latitude}-${loc.longitude}`"
    :value="loc"
  >
     {{ loc.name }}, {{ loc.admin1 || '' }}, {{ loc.country }}
  </option>
</select>

        <div v-if="weather">
            <h2>{{ location }}</h2>
            <p> Temperature: {{ weather.temperature }} °C</p>
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
</script>


<style scoped>
.card {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
    border-radius: 8px;
    padding: 10px;
    background: #6c63ff;
    color: white;
    font-size: 14px;
    cursor: pointer;
}
button:hover{
    background: #574fd6;
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
</style>