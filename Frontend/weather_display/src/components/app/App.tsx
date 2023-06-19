import {useEffect, useRef, useState} from 'react';
import './App.css';
import WeatherData from '../../types/weatherdata';
import { startWeatherOrchestrator, addWeatherLocation } from '../../api/weathercontroller'; 
import WeatherBody from '../weatherbody/WeatherBody';
import AddLocation from '../addlocation/AddLocation';
import { fetchUserData, updateUserLocations } from '../../api/usercontroller';
import User from '../../types/user';
import { getCurrUser } from '../../utils/user-util';

function App() {

  const [idCount, setIdCount] = useState<number>(0)
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [currUser, setCurrUser] = useState<User>({
    id: '-1',
    locations: []
  })
  const didRender = useRef(false);
  const hasBeenFetched = useRef(false);

  const setUserData = async () => {
    /*if (process.env.NODE_ENV == 'production') {*/
    if (window.location.href == 'https://myweatherfasco.azurewebsites.net/') {
      await getCurrUser()
          .then((userid) => {
            fetchUserData(userid)
            .then((res: any) => {
              const data = res.data[0]
              setCurrUser({
                id: data.id, 
                locations: data.locations
              })
            })
          });
    }
    else {
      fetchUserData('rfasco98@gmail.com')
      .then((res: any) => {
        const data = res.data[0]
        setCurrUser({
          id: data.id, 
          locations: data.locations
        })
      })
      .catch((err) => console.log(err));
    }
  };

  const fetchWeatherData = async () => {
    return await startWeatherOrchestrator(currUser.locations).then(res => {
      let id = 0;
      console.log(currUser)
      if (res === undefined) {
        return;
      }
      const weatherStateData = res.output.results;
      weatherStateData.forEach((result: WeatherData, index: number) => {
        const newRecord = {...result, id: idCount, zip: currUser.locations[index]}
        id = id + 1
        setIdCount(index);
        console.log(index)
        console.log(newRecord)
        weatherStateData[index] = newRecord
        return newRecord;
      })
      setWeatherData(weatherStateData)
    });
  }

  /**
   * set up initial data
   */
  useEffect(() => {
    setUserData()
  }, [])

  /**
   * add location to user
   */
  useEffect(() => {
    if (!didRender.current) {
      didRender.current = true;
      return;
    } else if (!hasBeenFetched.current) {
      hasBeenFetched.current = true;
      if (currUser.locations.length != 0) {
        fetchWeatherData();
      }
      return;
    }
    console.log('updating user locations')
    updateUserLocations(currUser.id, currUser?.locations)
    .then((res) => {
      console.log(res)
    })
  }, [currUser])


  const removeLocation = (zip: string) => {
    console.log(zip)
    setWeatherData((prevData) => {
      console.log(prevData)
      return prevData.filter((data) => data.zip != zip)
    });
    const newLocations = currUser.locations.filter((location) => location != zip)
    setCurrUser({...currUser, locations: newLocations})
    console.log(currUser)
  }

  const addLocation = async (zip: string) => {
    console.log(parseInt(zip))
    if (isNaN(parseInt(zip))) {
      alert('Please enter a valid zip code')
    } else if (zip.length != 5) {
      console.log(zip)
      alert('Please enter a 5 digit zip code')
    } else {
      await addWeatherLocation(zip)
      .then((res: any) => {
            if (res != 'ERR_BAD_REQUEST') {
              const resData: WeatherData = res
              const newRecord = {...resData, id: idCount, zip: zip}
              setIdCount(prevCount => prevCount + 1);
              setWeatherData([...weatherData, newRecord])
              setCurrUser({...currUser, locations: [...currUser.locations, zip]})
            } else {
              alert('Zip code not found')
            }
        }
      )
      
      
    }
  }

  return (
    <div className="App">
      <header className="App-header">
          My Weather
      </header>
      <WeatherBody weatherData={weatherData} removeLocation={removeLocation}/>
      <AddLocation addLocation={addLocation}/>
    </div>
  );
}

export default App;
