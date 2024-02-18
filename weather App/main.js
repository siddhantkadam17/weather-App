

import {getweather} from "./weather.js";
import {iconMap} from './iconmap.js';

navigator.geolocation.getCurrentPosition(success,failure);

function success({coords}){
    getweather(
        coords.latitude,
        coords.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderweather)
        .catch((err)=>{
        console.log(err)
        alert('Error in get weather update.')
    })
    
}
function failure() {
    alert(
      "There was an error getting your location. Please allow us to use your location and refresh the page."
    )
  }


function renderweather({current,hourly,daily}){
    rendercurrentweather(current);
    renderdailyweather(daily);
    renderhourlyweather(hourly);
    var blur = document.querySelector('.blurred');
    blur.style.filter = 'none';
}

function setvalue(selector,value,{parent = document}={}){
    console.log(parent.querySelector(`[data-${selector}]`))
    parent.querySelector(`[data-${selector}]`).textContent= value;
    
}

function url(iconcode){
    // console.log(iconMap)
    return `${iconMap.get(iconcode)}.svg`
}

function rendercurrentweather(current){
    setvalue("current-temp",current.currenttemp);
    setvalue("current-high",current.hightemp);
    setvalue("current-low",current.lowtemp);
    setvalue("current-fl-high",current.highfeelslike);
    setvalue("current-fl-low",current.lowfeelslike);
    setvalue("current-wind",current.windspeed);
    setvalue("current-precip",current.precip)
    document.querySelector('[data-current-icon]').src = url(current.iconcode);

}
var formatter = new Intl.DateTimeFormat(undefined,{weekday:"long"})
var table = document.getElementsByClassName("day-card");
function renderdailyweather(daily){

    const array = Array.prototype
            .slice.call(table);
   
    var fc = array[0].children[0];
    console.log(fc ,daily);   
    array.forEach((element,index) => {
        var fc = element.children[0];
        var sc = element.children[1] ;
        var th = element.children[2];
       
        var temp = url(daily[index].iconcode);
        fc.src= temp;
        sc.textContent = formatter.format(daily[index].timestamp)
        th.textContent = daily[index].maxtemp;
    });
}


const Hour_formatter = new Intl.DateTimeFormat(undefined,{hour:'numeric'});
function firstsection(element,hourly,index){
    var mainclass = element.children[0];
    var firstchild = mainclass.children[0];
    var secondchild = mainclass.children[1];
    firstchild.textContent = formatter.format(hourly[index].timestamp);
    secondchild.textContent  = Hour_formatter.format(hourly[index].timestamp);    
}
function setfltemp(hourly,element,index){
    var mainclass = element.children[0];
    // var firstchild = mainclass.children[0];
    var secondchild = mainclass.children[1];
    secondchild.textContent = hourly[index].feelslike;
}
function setwind(hourly,element,index){
    var mainclass = element.children[0];
    // var firstchild = mainclass.children[0];
    var secondchild = mainclass.children[1];
    secondchild.textContent = hourly[index].windspeed;
}
function settemp(hourly,element,index){
    var mainclass = element.children[0];
    // var firstchild = mainclass.children[0];
    var secondchild = mainclass.children[1];
    secondchild.textContent = hourly[index].temp;
}
function setprecip(hourly,element,index){
    var mainclass = element.children[0];
    // var firstchild = mainclass.children[0];
    var secondchild = mainclass.children[1];
    secondchild.textContent =`${ hourly[index].precip}in`;
}
var selecthour = document.getElementsByClassName(`hour-row`);
function  renderhourlyweather(hourly){
    console.log(hourly);
    const selectrow = Array.prototype
            .slice.call(selecthour);
    selectrow.forEach((element,index)=>{
        var td = element.querySelectorAll('td');
        var tdarray = Array.prototype.slice.call(td);
        firstsection(td[0],hourly,index);
        var seticon = td[1];
        var settt = seticon.children[0];
        settt.src =url(hourly[index].iconcode);
        settemp(hourly,td[2],index);
        setfltemp(hourly,td[3],index);
        setwind(hourly,td[4],index);
        setprecip(hourly,td[5],index);
    })
}



