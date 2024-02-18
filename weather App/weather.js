
export function getweather(lat,lon,timezone){
    const baseUrl = "https://api.open-meteo.com/v1/forecast";
    const queryParams = new URLSearchParams({
        hourly: "temperature_2m,apparent_temperature,precipitation,weather_code",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum",
        current_weather: true,
        temperature_unit: "celsius",
        windspeed_unit: "mph",
        precipitation_unit: "inch",
        timeformat: "unixtime",
        latitude: lat,
        longitude: lon,
        timezone: timezone
    });
    const url = `${baseUrl}?${queryParams}`
    return fetch(url)
        .then((response =>{
           return response.json();
        }))
        .then((data)=>{
            return{
                current:givecurrentweather(data),
                hourly:givehourlyweather(data),
               daily:givedailyweather(data)
            }
        })
}

function givecurrentweather({current_weather,daily}){
    const {
        temperature:currenttemp,
        windspeed:windspeed,
        weathercode:iconcode,
    }=current_weather;  
    const {
        temperature_2m_max:[maxtemp],
        temperature_2m_min:[mintemp],
        apparent_temperature_max:[highfeelslike],
        apparent_temperature_min:[lowfeelslike],
        precipitation_sum:[precip],
    }=daily;
    return{
        currenttemp,
        hightemp:maxtemp,
        lowtemp:mintemp,
        highfeelslike:[highfeelslike],
        lowfeelslike:[lowfeelslike],
        windspeed,
        precip:precip,
        iconcode
    }   
}

function givedailyweather({daily}){
    return daily.time.map((time,index)=>{
        return{
            timestamp:time*1000,
            iconcode:daily.weather_code[index],
            maxtemp:Math.round(daily.apparent_temperature_max[index])
        }
    })
}

function givehourlyweather({hourly,current_weather}){
    return hourly.time
    .map((time,index)=>{
       return{
        timestamp:time*1000,
        iconcode:hourly.weather_code[index],
        temp:Math.round(hourly.temperature_2m[index]),
        feelslike:Math.round(hourly.apparent_temperature[index]),
        windspeed:Math.round(current_weather.windspeed),
        precip:Math.round(hourly.precipitation[index]*100)/100,
       }
    }).filter(({timestamp})=>timestamp >=  current_weather.time*1000)

}

