export async function getCoordinates(city) {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5`
    )
    if (!response.ok)
        //throw new Error('Failed to fetch coordinates')
        return []
    const data = await response.json()
    //if (!data.results || data.results.length === 0){
      //  return null
    //}
    return data.results || []
}

export async function getWeather(latitude, longitude){
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    )
    if (!response.ok){
        //throw new Error('Failed to fetch weather data')
        return null
    }
    const data = await response.json()
    return data
}