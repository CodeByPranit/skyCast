const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
});

// Weather data fetching
async function fetchWeatherData(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=${location}&days=5`);
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function updateWeatherUI(data) {
    // Current weather
    document.querySelector('.location-name').textContent = data.location.name;
    document.querySelector('.location-date').textContent = formatDate(data.location.localtime);
    document.querySelector('.temperature').textContent = `${Math.round(data.current.temp_f)}°F`;
    document.querySelector('.weather-description').textContent = data.current.condition.text.toLowerCase();
    
    // Weather details
    document.querySelector('.detail-value:nth-of-type(1)').textContent = `${data.current.wind_mph} mph`;
    document.querySelector('.detail-value:nth-of-type(2)').textContent = `${data.current.humidity}%`;
    document.querySelector('.detail-value:nth-of-type(3)').textContent = `${data.forecast.forecastday[0].day.daily_will_it_rain}%`;
    document.querySelector('.detail-value:nth-of-type(4)').textContent = `${data.current.vis_miles} mi`;
    
    // 5-day forecast
    const forecastDays = document.querySelectorAll('.forecast-day');
    data.forecast.forecastday.forEach((day, index) => {
        forecastDays[index].querySelector('.forecast-day-name').textContent = 
            new Date(day.date).toLocaleDateString('en', { weekday: 'short' });
        forecastDays[index].querySelector('.forecast-temp-max').textContent = `${Math.round(day.day.maxtemp_f)}°`;
        forecastDays[index].querySelector('.forecast-temp-min').textContent = `${Math.round(day.day.mintemp_f)}°`;
        updateWeatherIcon(forecastDays[index].querySelector('.forecast-day-icon'), day.day.condition.text);
    });
}

function updateWeatherIcon(element, condition) {
    // Map conditions to Font Awesome icons
    const icons = {
        'Sunny': 'fa-sun',
        'Partly cloudy': 'fa-cloud-sun',
        'Cloudy': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Thunderstorm': 'fa-bolt',
        'Snow': 'fa-snowflake'
    };
    element.className = `fas ${icons[condition] || 'fa-cloud'} forecast-day-icon`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Initialize with default location
fetchWeatherData('New York');

// Search functionality
searchBtn.addEventListener('click', () => {
    if (searchInput.value.trim()) {
        fetchWeatherData(searchInput.value.trim());
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
        fetchWeatherData(searchInput.value.trim());
    }
});