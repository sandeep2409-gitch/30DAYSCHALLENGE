/*
 * Weather App // Vue 3 Controller
 * Communicates exclusively with the secure /api/weather Serverless proxy.
 * Zero hardcoded keys or sandbox dummy modes.
 */

const { createApp, ref, computed, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    // --- Application State ---
    const weather = ref(null);
    const hourlyForecasts = ref([]);
    const dailyForecasts = ref([]);
    const loading = ref(true);
    
    const searchQuery = ref('');
    const searchFocus = ref(false);
    const searchSuggestions = ref([]);
    
    const unitPreference = ref('metric'); // 'metric' or 'imperial'
    const favorites = ref(['London', 'Tokyo', 'Sydney', 'Cairo']);
    const currentCity = ref('London');
    
    const gpsLoading = ref(false);
    const toast = ref({ show: false, message: '', type: 'info' });
    let toastTimeout = null;
    
    // Ticker state for local clock
    const currentTimeTicker = ref(new Date());
    let tickerInterval = null;

    // --- Computed Values ---
    const capitalizedDescription = computed(() => {
      if (!weather.value || !weather.value.weather[0]) return '';
      const desc = weather.value.weather[0].description;
      return desc.charAt(0).toUpperCase() + desc.slice(1);
    });

    const isPinned = computed(() => {
      if (!weather.value) return false;
      return favorites.value.some(
        fav => fav.toLowerCase() === weather.value.name.toLowerCase()
      );
    });

    const weatherTheme = computed(() => {
      if (!weather.value || !weather.value.weather[0]) return 'clear';
      const id = weather.value.weather[0].id;
      
      if (id >= 200 && id < 300) return 'thunderstorm';
      if (id >= 300 && id < 600) return 'rain';
      if (id >= 600 && id < 700) return 'snow';
      if (id >= 700 && id < 800) return 'atmosphere'; // Mist, fog, sand
      if (id === 800) return 'clear';
      if (id > 800) return 'clouds';
      
      return 'clear';
    });

    const weatherThemeClass = computed(() => `theme-${weatherTheme.value}`);

    const hasActiveParticles = computed(() => {
      return ['rain', 'thunderstorm', 'snow'].includes(weatherTheme.value);
    });

    // Speed unit translators
    const speedUnit = computed(() => unitPreference.value === 'metric' ? 'm/s' : 'mph');
    const speedMultiplier = computed(() => unitPreference.value === 'metric' ? 1 : 2.237);

    // Dynamic Sunrise / Sunset solar arc node placement
    const sunPos = computed(() => {
      if (!weather.value || !weather.value.sys) return { x: 5, y: 45 };
      
      const nowUnix = Math.floor(currentTimeTicker.value.getTime() / 1000) + (weather.value.timezone || 0) - (new Date().getTimezoneOffset() * 60);
      const sunrise = weather.value.sys.sunrise;
      const sunset = weather.value.sys.sunset;
      
      if (nowUnix < sunrise || nowUnix > sunset) {
        // Nighttime - pin sun below the ground line
        return { x: nowUnix > sunset ? 95 : 5, y: 45 };
      }
      
      // Calculate relative progress along daylight hours
      const totalDaylight = sunset - sunrise;
      const elapsedDaylight = nowUnix - sunrise;
      const progress = totalDaylight > 0 ? elapsedDaylight / totalDaylight : 0.5;
      
      // Map progress to radians along a 180-deg circle (π to 0)
      const angle = Math.PI * (1 - progress);
      
      // SVG center is (50, 45), radius is 40
      const x = 50 + 40 * Math.cos(angle);
      const y = 45 - 40 * Math.sin(angle);
      
      return { x, y };
    });

    const sunCycleLabel = computed(() => {
      if (!weather.value || !weather.value.sys) return '';
      
      const nowUnix = Math.floor(new Date().getTime() / 1000);
      const timezoneShift = (weather.value.timezone || 0) + (new Date().getTimezoneOffset() * 60);
      const localTime = nowUnix + timezoneShift;
      
      const sunrise = weather.value.sys.sunrise;
      const sunset = weather.value.sys.sunset;
      
      if (localTime < sunrise) {
        const diffHours = Math.round((sunrise - localTime) / 3600);
        return `Sunrise in approx ${diffHours}h`;
      } else if (localTime > sunset) {
        const diffHours = Math.round((localTime - sunset) / 3600);
        return `Sunset occurred ${diffHours}h ago`;
      } else {
        const diffHours = Math.round((sunset - localTime) / 3600);
        return `${diffHours} hours of daylight remaining`;
      }
    });

    // Formatting date & time shifts relative to selected city timezone
    const localDateString = computed(() => {
      if (!weather.value) return '';
      const localTime = getShiftedLocalTime();
      return localTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    });

    const localTimeString = computed(() => {
      if (!weather.value) return '';
      const localTime = getShiftedLocalTime();
      return localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    });

    // --- Core Methods ---
    
    // Calculates the exact time inside the searched city's timezone
    function getShiftedLocalTime() {
      if (!weather.value) return new Date();
      const sysTimezoneOffsetSec = weather.value.timezone || 0; // Offset from UTC in seconds
      const localOffsetMin = new Date().getTimezoneOffset(); // Local browser offset from UTC in minutes
      
      const utcTime = new Date().getTime() + (localOffsetMin * 60 * 1000);
      return new Date(utcTime + (sysTimezoneOffsetSec * 1000));
    }

    function showToast(message, type = 'info') {
      if (toastTimeout) clearTimeout(toastTimeout);
      toast.value = { show: true, message, type };
      toastTimeout = setTimeout(() => {
        toast.value.show = false;
      }, 4000);
    }

    // Triggered when switching Metric / Imperial
    function toggleUnits(unit) {
      if (unitPreference.value === unit) return;
      unitPreference.value = unit;
      showToast(`Units switched to ${unit === 'metric' ? 'Metric (°C)' : 'Imperial (°F)'}`, 'info');
      fetchWeatherForCity(currentCity.value);
    }

    // Modal dialogue toggles
    function openSettings() {
      const dialog = document.getElementById('settingsDialog');
      if (dialog) dialog.showModal();
    }

    function closeSettings() {
      const dialog = document.getElementById('settingsDialog');
      if (dialog) dialog.close();
      fetchWeatherForCity(currentCity.value);
    }

    function resetDashboardDefaults() {
      localStorage.removeItem('aether_favorites');
      favorites.value = ['London', 'Tokyo', 'Sydney', 'Cairo'];
      unitPreference.value = 'metric';
      currentCity.value = 'London';
      showToast('All dashboard settings reset to defaults.', 'success');
      closeSettings();
    }

    // Favorites Pin Toggle
    function togglePinCity() {
      if (!weather.value) return;
      const city = weather.value.name;
      const idx = favorites.value.findIndex(f => f.toLowerCase() === city.toLowerCase());
      
      if (idx !== -1) {
        favorites.value.splice(idx, 1);
        showToast(`${city} removed from pinned shortcuts`, 'info');
      } else {
        favorites.value.push(city);
        showToast(`${city} pinned to your dashboard bar`, 'success');
      }
      localStorage.setItem('aether_favorites', JSON.stringify(favorites.value));
    }

    function selectFavorite(fav) {
      currentCity.value = fav;
      fetchWeatherForCity(fav);
    }

    function removeFavorite(fav) {
      favorites.value = favorites.value.filter(f => f !== fav);
      localStorage.setItem('aether_favorites', JSON.stringify(favorites.value));
      showToast(`${fav} unpinned`, 'info');
    }

    // Search Operations
    function triggerSearch() {
      const q = searchQuery.value.trim();
      if (!q) return;
      currentCity.value = q;
      fetchWeatherForCity(q);
      searchQuery.value = '';
      searchSuggestions.value = [];
      searchFocus.value = false;
    }

    async function handleSearchInput() {
      const query = searchQuery.value.trim().toLowerCase();
      if (query.length < 2) {
        searchSuggestions.value = [];
        return;
      }
      
      try {
        // Query autocomplete directly through Serverless Geocoder proxy
        const url = `/api/weather?query=${encodeURIComponent(query)}&type=direct`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          searchSuggestions.value = data.map(c => {
            return {
              name: c.name,
              state: c.state || '',
              country: c.country,
              lat: c.lat,
              lon: c.lon
            };
          });
        }
      } catch (e) {
        searchSuggestions.value = [];
      }
    }

    function selectSuggestion(item) {
      currentCity.value = item.name;
      fetchWeatherForCity(item.name);
      searchQuery.value = '';
      searchSuggestions.value = [];
      searchFocus.value = false;
    }

    function handleSearchBlur() {
      setTimeout(() => {
        searchFocus.value = false;
      }, 200);
    }

    // --- Weather Fetch Engine (Queries Backend Proxy) ---
    async function fetchWeatherForCity(cityName) {
      loading.value = true;
      const units = unitPreference.value === 'metric' ? 'metric' : 'imperial';
      const cacheKey = `aether_cache_${cityName.toLowerCase()}_${units}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const ageSec = (new Date().getTime() - parsed.timestamp) / 1000;
          
          if (ageSec < 600) { // 10 minutes cache lifespan
            weather.value = parsed.weather;
            hourlyForecasts.value = parsed.hourly;
            dailyForecasts.value = parsed.daily;
            loading.value = false;
            return;
          }
        } catch (e) {
          localStorage.removeItem(cacheKey);
        }
      }

      try {
        // Fetch current weather via secure local serverless endpoint
        const weatherUrl = `/api/weather?city=${encodeURIComponent(cityName)}&units=${units}&type=weather`;
        const wRes = await fetch(weatherUrl);
        
        if (!wRes.ok) {
          if (wRes.status === 404) throw new Error('City meteorological data not found.');
          throw new Error('API proxy server error occurred.');
        }
        
        const wData = await wRes.json();

        // Fetch 5-Day Forecast via secure local serverless endpoint
        const forecastUrl = `/api/weather?city=${encodeURIComponent(cityName)}&units=${units}&type=forecast`;
        const fRes = await fetch(forecastUrl);
        let hForecasts = [];
        let dForecasts = [];

        if (fRes.ok) {
          const fData = await fRes.json();
          
          // Map hourly: take first 8 items (next 24 hours in 3-hour blocks)
          hForecasts = fData.list.slice(0, 8).map(item => {
            return {
              ...item,
              theme: mapWeatherIdToTheme(item.weather[0].id)
            };
          });

          // Map 5-day daily: group by day
          const daysMap = {};
          fData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            if (!daysMap[dayKey]) {
              daysMap[dayKey] = [];
            }
            daysMap[dayKey].push(item);
          });

          dForecasts = Object.values(daysMap).slice(0, 5).map(dayItems => {
            let maxTemp = -999;
            let minTemp = 999;
            let totalHumidity = 0;
            
            dayItems.forEach(di => {
              if (di.main.temp_max > maxTemp) maxTemp = di.main.temp_max;
              if (di.main.temp_min < minTemp) minTemp = di.main.temp_min;
              totalHumidity += di.main.humidity;
            });

            const midItem = dayItems[Math.floor(dayItems.length / 2)];
            return {
              dt: midItem.dt,
              weather: midItem.weather,
              theme: mapWeatherIdToTheme(midItem.weather[0].id),
              humidity: Math.round(totalHumidity / dayItems.length),
              temp: { min: minTemp, max: maxTemp }
            };
          });
        }

        // Set references
        weather.value = wData;
        hourlyForecasts.value = hForecasts;
        dailyForecasts.value = dForecasts;

        // Cache responses
        const cachePayload = {
          timestamp: new Date().getTime(),
          weather: wData,
          hourly: hForecasts,
          daily: dForecasts
        };
        localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
        
        loading.value = false;
        showToast(`Real-time weather loaded for ${wData.name}`, 'success');

      } catch (err) {
        showToast(err.message, 'error');
        loading.value = false;
      }
    }

    // Geolocation Resolution via secure proxy
    function getUserLocation() {
      if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser', 'error');
        return;
      }
      
      gpsLoading.value = true;
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // Secure reverse geocode request through backend serverless endpoint
            const url = `/api/weather?lat=${lat}&lon=${lon}&type=reverse`;
            const res = await fetch(url);
            
            if (res.ok) {
              const data = await res.json();
              if (data.length > 0) {
                const resolvedCity = data[0].name;
                currentCity.value = resolvedCity;
                fetchWeatherForCity(resolvedCity);
                showToast(`Location resolved to ${resolvedCity}!`, 'success');
              } else {
                throw new Error();
              }
            } else {
              throw new Error();
            }
          } catch (e) {
            showToast("Could not resolve location coordinates.", "error");
          } finally {
            gpsLoading.value = false;
          }
        },
        (error) => {
          gpsLoading.value = false;
          showToast(`Location access denied or timed out.`, 'error');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    // Helper mapping functions
    function mapWeatherIdToTheme(id) {
      if (id >= 200 && id < 300) return 'thunderstorm';
      if (id >= 300 && id < 600) return 'rain';
      if (id >= 600 && id < 700) return 'snow';
      if (id >= 700 && id < 800) return 'atmosphere';
      if (id === 800) return 'clear';
      return 'clouds';
    }

    function getWindCardinal(deg) {
      if (deg === undefined) return 'CALM';
      const angles = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(deg / 22.5) % 16;
      return angles[index];
    }

    function getHumidityVerdict(h) {
      if (h < 30) return 'Very Dry Air';
      if (h <= 55) return 'Optimal Comfort';
      if (h <= 70) return 'Sticky / Humid';
      return 'Very Damp / Wet';
    }

    function formatVisibility(meters) {
      if (!meters) return '10 km';
      const km = meters / 1000;
      if (unitPreference.value === 'metric') {
        return `${km.toFixed(1)} km`;
      } else {
        const miles = km * 0.621371;
        return `${miles.toFixed(1)} mi`;
      }
    }

    function formatLocalUnixTime(unixSec) {
      if (!unixSec || !weather.value) return '';
      const timezoneShift = (weather.value.timezone || 0) + (new Date().getTimezoneOffset() * 60);
      const shiftedUnix = unixSec + timezoneShift;
      const date = new Date(shiftedUnix * 1000);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    function formatForecastHour(unixSec) {
      if (!unixSec) return '';
      const date = new Date(unixSec * 1000);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    }

    function formatForecastDay(unixSec) {
      if (!unixSec) return '';
      const date = new Date(unixSec * 1000);
      const today = new Date().getDay();
      if (date.getDay() === today) return 'Today';
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    // Apple-style daily min-max temperature slider metrics
    function forecastSliderStyle(min, max) {
      if (!weather.value) return {};
      const rangeMax = weather.value.main.temp_max + 8;
      const rangeMin = weather.value.main.temp_min - 8;
      const totalSpan = rangeMax - rangeMin;
      
      const left = ((min - rangeMin) / totalSpan) * 100;
      const width = ((max - min) / totalSpan) * 100;
      
      return {
        left: `${Math.max(Math.min(left, 85), 0)}%`,
        width: `${Math.max(Math.min(width, 100), 15)}%`
      };
    }

    // Render radial gauge percentages
    function radialProgressStyle(percentage) {
      const circum = 2 * Math.PI * 15.9155;
      const strokeVal = circum - (percentage / 100) * circum;
      return {
        strokeDasharray: `${circum} ${circum}`,
        strokeDashoffset: strokeVal
      };
    }

    // Random styling builders for rain drops and snowflakes
    function getRandomRainStyle() {
      return {
        left: Math.random() * 100 + '%',
        top: Math.random() * -20 - 20 + 'px',
        animationDelay: Math.random() * 1.5 + 's',
        animationDuration: 0.8 + Math.random() * 0.6 + 's',
        opacity: 0.3 + Math.random() * 0.5
      };
    }

    function getRandomSnowStyle() {
      const size = 3 + Math.random() * 4;
      return {
        left: Math.random() * 100 + '%',
        top: Math.random() * -20 - 20 + 'px',
        width: size + 'px',
        height: size + 'px',
        animationDelay: Math.random() * 4 + 's',
        animationDuration: 4 + Math.random() * 4 + 's',
        opacity: 0.4 + Math.random() * 0.6
      };
    }

    function capitalizeWord(str) {
      if (!str) return '';
      return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // --- Life Cycle Hooks ---
    onMounted(() => {
      // Recover saved favorites configuration
      const savedFavs = localStorage.getItem('aether_favorites');
      if (savedFavs) {
        try {
          favorites.value = JSON.parse(savedFavs);
        } catch (e) {
          localStorage.removeItem('aether_favorites');
        }
      }

      // Fetch initial city weather
      fetchWeatherForCity(currentCity.value);

      // Start clocks ticker interval
      tickerInterval = setInterval(() => {
        currentTimeTicker.value = new Date();
      }, 1000);
      
      // Fallback click listener for native dialog backdrop light-dismiss
      const dialog = document.getElementById('settingsDialog');
      if (dialog && !('closedBy' in HTMLDialogElement.prototype)) {
        dialog.addEventListener('click', (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isInside = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
          );
          if (!isInside) dialog.close();
        });
      }
    });

    onUnmounted(() => {
      if (tickerInterval) clearInterval(tickerInterval);
    });

    return {
      weather,
      hourlyForecasts,
      dailyForecasts,
      loading,
      searchQuery,
      searchFocus,
      searchSuggestions,
      unitPreference,
      favorites,
      currentCity,
      gpsLoading,
      toast,
      
      // Computeds
      capitalizedDescription,
      isPinned,
      weatherTheme,
      weatherThemeClass,
      hasActiveParticles,
      speedUnit,
      speedMultiplier,
      sunPos,
      sunCycleLabel,
      localDateString,
      localTimeString,

      // Methods
      toggleUnits,
      openSettings,
      closeSettings,
      resetDashboardDefaults,
      togglePinCity,
      selectFavorite,
      removeFavorite,
      triggerSearch,
      handleSearchInput,
      selectSuggestion,
      handleSearchBlur,
      getUserLocation,
      formatLocalUnixTime,
      formatForecastHour,
      formatForecastDay,
      forecastSliderStyle,
      radialProgressStyle,
      getRandomRainStyle,
      getRandomSnowStyle,
      getWindCardinal,
      getHumidityVerdict,
      formatVisibility,
      capitalizeWord
    };
  }
}).mount('#app');
