
      let lat, lon, weather, air; 

      if ("geolocation" in navigator) { 
        console.log('geolocation available')
        navigator.geolocation.getCurrentPosition(async function(position) {
        const {latitude, longitude} = position.coords
        console.log(latitude);
        console.log(position.coords.longitude);
        lat = latitude.toPrecision(4);
        lon = longitude.toPrecision(4);
        console.log(lat);
        document.getElementById("lat").textContent = lat;
        document.getElementById("lon").textContent = lon;

        const weather_url = `/weather/${lat},${lon}`;
        const weather_response = await fetch(weather_url);
        const weather_data = await weather_response.json();
        
        console.log(weather_data);
        weather = weather_data.weather.currently; // kind of dumb, but whatever
        const {summary, temperature} = weather;
        document.getElementById("weather").textContent = `${temperature.toPrecision(2)}°F and ${summary}`;

        try{
          air = weather_data.air_quality.results[0].measurements[0];
          document.getElementById("param").textContent = `The concentration of particulate matter (${air.parameter})`;
          document.getElementById("value").textContent = `is ${air.value} ${air.unit}`;
          document.getElementById("lastUpdated").textContent = `last updated on ${air.lastUpdated}`;

        } catch(error)
        {
          air = {value: -1};
          document.getElementById("param").textContent = "No air quality information is available for this location";
        }

        const data = {lat, lon, weather, air};
        const options = {
          method: 'POST',
          headers: {
                      'Content-Type': 'application/json'
                    },
        body: JSON.stringify(data)
        };
        const response = await fetch('/api', options);
        const json = await response.json();


        });
  } else {
    console.log('geolocation NOT available');
  }

    
