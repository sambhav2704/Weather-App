var API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchFrom = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container")

let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

//change
const grantAccessBtn = document.querySelector("[data-GrantAccess]");
grantAccessBtn.addEventListener( 'click' , getLocation());

// Switching

//To switch tabs 
function switchTab(clickedTab){
    if(currentTab !== clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        
        if(!searchFrom.classList.contains("active")){
            //current tab is userInfo tab we have to switch it to search tab
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchFrom.classList.add("active");
        }
        else{
            //current tab is search tab have to switch on userInfo tab
            searchFrom.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //now we have switched to userInfo tab we have to dispaly the weather of users current location to lets check the session storage first 
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener('click' , () => {
    switchTab(userTab);
})

searchTab.addEventListener('click' , () => {
    switchTab(searchTab);
})

// to check if users coordiantes are available 
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        //if local coordinates are not available
       grantAccessContainer.classList.add("active");

    }
    else{
        const coordiantes = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordiantes);
    }
}



function renderWeatherInfo(weatherInfo){
    //we have to fetch the required elements 

    const cityname = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherdesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //fetch values form json object and put them into ui elements

    cityname.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    temp.innerText = weatherInfo?.main?.temp;
    weatherIcon.src =  `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    windSpeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;


}

async function fetchUserWeatherInfo(coordiantes){
    const {lat , lon} = coordiantes;
    grantAccessContainer.classList.remove("active");
    //visible loaader
    loadingScreen.classList.add("active");

    //API call 
    try{
        const response = await fetch(
           `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        //remove loader
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        // handle the error 
    }
    
}



function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation Support Available");
    }
}

function showPosition (position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}


async function fetchSearchWeatherInfo(cityname){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response =  await fetch (
            `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }catch(err){
        //will handle 
    }

}


//changes

searchFrom.addEventListener('submit' , (e)=> {
    const searchInput = document.querySelector("[data-searchInput]").value;
  
    e.preventDefault();
    let cityname = searchInput;

    if (searchInput == ""){
        console.log("empty ");
        return;
    }
    else{
        console.log("hello");
        fetchSearchWeatherInfo(cityname);
    }
});