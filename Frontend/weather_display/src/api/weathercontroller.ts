import axios from 'axios';
import { createApiParams } from '../utils/api-utils';

const startWeatherOrchestrator = async (zips: string[]) => {
    const params: string = createApiParams(zips)
    console.log(params)
    return (await axios.get(`https://weatherfetchdurable.azurewebsites.net/api/orchestrators/FetchOrchestratorOrchestrator?${params}`, {headers: {
      'Access-Control-Allow-Origin':'https://myweatherfascolinux.azurewebsites.net',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': '*'
    },
    withCredentials: true})
    .then((res: any) => {
        console.log(res);
        return fetchWeatherData(res.data.statusQueryGetUri)
    })
    .catch((err) => console.log(err)));
}

const fetchWeatherData: any = async (url: any) => {
    return await axios.get(url, {headers: {
      'Access-Control-Allow-Origin':'https://myweatherfascolinux.azurewebsites.net',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': '*'
    },
    withCredentials: true})
      .then(response => {
        console.log(response)
        return response.data;
      })
      .catch((err) => console.log(err));
      
  }

  const addWeatherLocation: any = async (zip: string) => {//change
    return await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${process.env.REACT_APP_WEATHERID}&units=imperial`)
    .then((res: any) => {
        return res.data;
    })
    .catch((err) => {
        return err.code
    });
  }

  export {startWeatherOrchestrator, fetchWeatherData, addWeatherLocation};