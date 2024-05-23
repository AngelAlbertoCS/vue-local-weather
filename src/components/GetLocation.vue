<template>
    <div>
      <p v-if="loading">Loading...</p>
      <div v-else>
        <p>Condition: {{ weather.current.condition.text }}</p>
        <p>Temperature: {{ weather.current.temp_c }}°C</p>
        <p>Location: {{ weather.location.name }}, {{ weather.location.region }}</p>
        <p>Wind: {{ weather.current.wind_kph }} kph, {{ weather.current.wind_degree }}°</p>
        <p data-testid="localtime">{{ formatDate(weather.location.localtime) }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const props = defineProps<{ coords: { latitude: number; longitude: number } }>();
  const weather = ref<any>(null);
  const loading = ref(true);
  
  function formatDate(datetime: string) {
    const date = new Date(datetime);
    return date.toLocaleString();
  }
  
  onMounted(async () => {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=41f98778aeae4d3dbfd190538242305&q=${props.coords.latitude},${props.coords.longitude}`);
    weather.value = await response.json();
    loading.value = false;
  });
  </script>
  