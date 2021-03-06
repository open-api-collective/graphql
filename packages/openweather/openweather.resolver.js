const { resolveAlias } = require('@openapi/core/utils');

const client = require('./client');
const { Unit } = require('./constants');

const createWeatherByCityIdResolver = () => async (
  obj,
  { cityName, unit = Unit.METRIC } = {},
  context,
  info
) => {
  const res = await client.get('', {
    params: {
      q: cityName,
      units: unit,
    },
  });

  return res.data;
};

const createWeatherByGeoLocResolver = () => async (
  obj,
  { lat, lng, unit = Unit.METRIC } = {},
  context,
  info
) => {
  const res = await client.get('', {
    params: {
      lat,
      lon: lng,
      units: unit,
    },
  });

  return res.data;
};

const resolveGeoLocation = () => (obj, cityName = {}, context, info) => ({
  latitude: obj.coord.lat,
  longitude: obj.coord.lon,
});

const resolveWind = () => (obj, cityName = {}, context, info) => ({
  speed: obj.wind.speed,
  degree: obj.wind.deg,
});

const resolveWeatherCondition = () => (obj, cityName = {}, context, info) => ({
  name: obj.weather[0].main,
  description: obj.weather[0].description,
});

module.exports = {
  Query: {
    currentWeatherByCityName: createWeatherByCityIdResolver(),
    currentWeatherByGeoLoc: createWeatherByGeoLocResolver(),
  },
  Weather: {
    temperature: resolveAlias('main.temp'),
    pressure: resolveAlias('main.pressure'),
    humidity: resolveAlias('main.humidity'),
    cityName: resolveAlias('name'),
    estimatedTime: resolveAlias('dt'),
    geoloc: resolveGeoLocation(),
    condition: resolveWeatherCondition(),
    wind: resolveWind(),
  },
};
