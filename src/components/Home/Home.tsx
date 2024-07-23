import { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.scss';
interface WeatherData {
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  name: string;
}
interface Country {
  name: string;
  lat: number;
  lon: number;
}

const countries: Country[] = [
  { name: 'Country1', lat: 44.34, lon: 10.99 },
  { name: 'Country2', lat: 48.85, lon: 2.35 },
];

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const base_URL = import.meta.env.VITE_API_URL;
  const key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await Promise.all(
          countries.map((country) =>
            axios.get(
              `${base_URL}?lat=${country.lat}&lon=${country.lon}&appid=${key}`
            )
          )
        );

        const weatherDataArray = response.map((res) => res.data);
        setWeatherData(weatherDataArray);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [base_URL, key]);

  return (
    <div className='home'>
      <h2 className='home__title'>Weather Data</h2>
      <div className='home__weather'>
        {weatherData.length > 0 ? (
          weatherData.map((data, index) => (
            <div key={index} className='home__weather-info'>
              <h3 className='home__weather-country'>{data.name}</h3>
              <p className='home__weather-temp'>
                Temperature: {data.main.temp}°C
              </p>
              <p className='home__weather-description'>
                Description: {data.weather[0].description}
              </p>
            </div>
          ))
        ) : (
          <p className='home__loading'>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
