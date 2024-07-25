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
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const base_URL = import.meta.env.VITE_API_URL;
  const key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      if (selectedCountry) {
        try {
          const response = await axios.get(
            `${base_URL}?lat=${selectedCountry.lat}&lon=${selectedCountry.lon}&appid=${key}`
          );

          setWeatherData(response.data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    fetchWeather();
  }, [selectedCountry, base_URL, key]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = event.target.value;
    const country = countries.find((c) => c.name === countryName) || null;
    setSelectedCountry(country);
  };

  return (
    <div className='home'>
      <h2 className='home__title'>Weather Data</h2>
      <select onChange={handleCountryChange} className='home__select'>
        <option value=''>Please Choose a country</option>
        {countries.map((country) => (
          <option key={country.name} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
      <div className='home__weather'>
        {weatherData && (
          <div className='home__weather-info'>
            <h3 className='home__weather-country'>{weatherData.name}</h3>
            <p className='home__weather-temp'>
              Temperature: {weatherData.main.temp}°C
            </p>
            <p className='home__weather-description'>
              Description: {weatherData.weather[0].description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
