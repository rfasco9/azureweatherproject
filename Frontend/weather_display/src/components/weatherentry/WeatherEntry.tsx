function WeatherEntry(props: any) {

  return (
    <div>
      <div>
        {props.weather.name}
      </div>
      <div>
        {props.weather.weather.description}
      </div>
      <div>
        Temperature: {props.weather.main.temp}
      </div>
      <div>
        Wind speed: {props.weather.wind.speed}
      </div>
      <button onClick={(e) => props.removeLocation(props.weather.zip)}>Remove Location</button>
    </div>
  );
}

export default WeatherEntry;
