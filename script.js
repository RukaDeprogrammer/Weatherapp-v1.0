const cards = document.querySelectorAll(".day-card")
let openCard = document.querySelector(".day-card.open")
const searchToggle = document.querySelector(".search")
const header = document.querySelector(".header")
const searchField = document.querySelector(".search-field")
const searchInput = document.querySelector(".search-input")
const searchButton = document.querySelector(".search-btn")
const h1 = document.querySelector("h1")

function createQuery(str) {
    return str.split(' ').join("%20")
}

async function getData(location) {
    const data = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=7NK7MAUGAYCNGFDMBU6CTGTUK&contentType=json`)
    const jData = await data.json();
    return jData
}

//Open card on click
cards.forEach(card => {
    card.addEventListener("click", (e) => {
        openCard.classList.remove("open")
        e.target.classList.add("open")
        openCard = e.target
})
})


//switch to search mode
function switchMode(text = "Check the weather in style") {
    h1.innerText = text
    header.classList.toggle("search-mode")
    searchInput.focus()
    searchToggle.classList.toggle("fa-search")
    searchToggle.classList.toggle("fa-close")
}

//Show search field on click
searchToggle.addEventListener("click", () => {
    switchMode()
})

//get the name of day
function getDayName(day) {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "Invalid day";
    }
  }

  //month names
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


//render Data on cards
function renderData(card, data) {
    const {conditions, humidity, tempmax, tempmin, windspeed, precipprob, datetime} = data
    const dataTime = new Date(datetime)
    const now = new Date()
    if (now.getDay() === dataTime.getDay()) {
        card.querySelector(".day").innerText = "Today"
    } else {
        card.querySelector(".day").innerText = getDayName(dataTime.getDay());
    }
    card.querySelector(".date").innerText = `${monthNames[dataTime.getMonth()]} ${dataTime.getDate().toString().padStart(2, "0")}`
    card.querySelector(".condition").innerText = conditions
    card.querySelector(".humidity-container .data span").innerText = humidity
    card.querySelector(".temp-max span").innerText = tempmax
    card.querySelector(".temp-min span").innerText = tempmin
    card.querySelector(".rain .data span").innerText = precipprob
    card.querySelector(".wind .data span").innerText = windspeed

}

//make title case

function titleCase(str) {
    let res = ""
    str.split(" ").forEach(sub => {
        for(let i = 0; i < sub.length; i++) {
            i === 0 ? res += sub[i].toUpperCase() : res += sub[i]
        }
        res += " "
    })
    return res
}

//get the data from user and return result

searchField.addEventListener("submit", (e) => {
    e.preventDefault()
    switchMode(titleCase(searchInput.value))
    getData(createQuery(searchInput.value))
    .then(res => {
        cards.forEach((card, i) => {
            renderData(card, res.days[i])
        })
    })
    searchInput.value = ''
})

//default to NYC

document.onload = getData(createQuery("new york"))
                    .then(res => {
                        cards.forEach((card, i) => {
                            renderData(card, res.days[i])
                        })
                    })