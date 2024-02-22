const userTab =document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainerv=document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm =document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer =document.querySelector(".user-infoContainer");
const errorContainer = document.querySelector(".error-container");

let oldTab = userTab;
const API_key = "626a51516bc4e93df7654d8dd6de8eb5";
oldTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab( newTab){
    // apiErrorContainer.classList.remove("active");
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            errorContainer.classList.remove("active");
        }
        else{
            // mai phle search wale tab pe tha
            searchForm.classList.remove("active");
            errorContainer.classList.remove("active");

            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
        // console.log("current- tab",currenTab)
    }
}

userTab.addEventListener('click',()=>{
     //pass clicked tab as input paramter
     switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    switchTab(searchTab); 
})

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates =JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon,}= coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
 console.log("inside fetch weather");
//  API call
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    // console.log("data",data);
  }
  catch(e){
    loadingScreen.classList.remove("active");
    
  }
    
}


function renderWeatherInfo( weatherInfo){
    const cityName =document.querySelector("[data-cityName]");
    const countryIcon =document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp =document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    // fetch values from weather info object and put in UI elements
      
    // optional chaining operator --> learn urself
    
    cityName.innerText = weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText =weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    console.log(temp);
    windspeed.innerText =`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText =`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;


}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation support");
    }
}

function showPosition(position){
    const userCoordinates={
    lat :position.coords.latitude,
     lon : position.coords.longitude,

    // console.log(lat);
    // console.log(lon);
 }
 sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
 console.log("weatherinfo se phle");
 fetchUserWeatherInfo(userCoordinates);
 console.log(userCoordinates);


}

const grantAccessButton =document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

const  searchInput = document.querySelector("[data-searchInput");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName==="")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    console.log(city);
    try{
        const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        if(data.cod && data.cod === "404") {
            // const err =  document.querySelector("[data-weatherIcon]");
            // err.src=`./assets/error.jpg`;   
            alert("City not found");
            userInfoContainer.classList.remove("active");
            errorContainer.classList.add("active");

        }
        else{
            errorContainer.classList.remove("active");
            renderWeatherInfo(data);
        }
    }
    catch(e){
        alert("Add a valid city");
    }

}




















// console.log("hello");
// async function fetchWeatherDetails(){

//     try{
       
//         let city_name = "goa";
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}&units=metric`);
//         const data =  await response.json();
//         console.log("weather data",data);// dont use here = +data

    
//         // let newPara = document.createElement('p');
//         // newPara.textContent = `${data?.main?.temp.toFixed(2)} ºC`;
//         // document.body.appendChild(newPara);

//         renderWeatherInfo(data); // rsposible for updating UI

//     }
//     catch(err){
//         console.log("invalid");
//     }
   
    
// }
// async function getCustoomWeatherDetails(){
//      try{
//         let lat = 15.333;
//       let lon = 74.083;
//       let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`)
//     const data =await result.json();
//     console.log(data);
//      }   
//      catch(e){
//         console.log("error found",e);
//      } 
    
// }

