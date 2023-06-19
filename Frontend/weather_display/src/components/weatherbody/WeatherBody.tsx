import WeatherData from "../../types/weatherdata";
import WeatherEntry from "../weatherentry/WeatherEntry";
import './WeatherBody.css'

function WeatherBody(props: any) {

    return (
        <div className="WeatherBody">
            {props.weatherData?.length != 0 ? props.weatherData.map((item: WeatherData) => {
                return (
                    <WeatherEntry weather={item} key={item.zip} removeLocation={props.removeLocation}/>
                );
            }) : 'No locations selected'}
        </div>
    );
  }
  
  export default WeatherBody;
  