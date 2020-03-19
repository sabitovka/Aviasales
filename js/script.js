const formSearch = document.querySelector(".form-search"),
        inputCitiesFrom = document.querySelector(".input__cities-from"),
        dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"),
        inputCitiesTo = document.querySelector(".input__cities-to")
        dropdownCitiesTo = document.querySelector(".dropdown__cities-to"),
        inputDateDepart = document.querySelector(".input__date-depart");

const CITIES_API = './data/cities.json'; //'http://api.travelpayouts.com/data/ru/cities.json';
const PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = '04ce4107846b4638e05f5cfbd3fa3115'; 
const CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';

const FROM = 'SVX' // код Екатеринбугра
const TO = 'KGD' // код Калининграда
const WHEN = '2020-05-25'; // на 25 мая 2020
const CALENDAR_PRELOAD = CALENDAR + `?origin=${FROM}&destination=${TO}&depart_date=${WHEN}&one_way=true` // строка запроса

let city = [];

// получает данные и обрабатывает их в callback
const getData = (url, callback) => {
    // создаем запрос
    const request = new XMLHttpRequest();

    // подлючаемся по урлу
    request.open('GET', url);

    // когда изменилось состояние готовности
    request.addEventListener('readystatechange', () => {
        // уходим если это не 4 состояине
        if (request.readyState !== 4) return;

        // обрабтываем если удачный запрос
        if (request.status === 200) {            
            callback(request.response)
        } else {
            console.error(request.status);
        }
    })

    request.send();
}

const showCities = (input, list) => {
    list.textContent = '';

    // если в инпуте пусто - ничего не надо показывать
    if (input.value === '') return;

    // фильруем по вхождению из инпута
    const filterCity = city.filter((item) => 
        item.name.toLowerCase().includes(input.value.toLowerCase())
    );

    // создаем DD
    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city')
        li.textContent = item.name + item.code;
        list.append(li);
    })
}

// обрабатывает нажатие на dd
const handleDropdown = (event, input, dropdown) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent
        dropdown.textContent = '';
    }
}

// INPUT FROM
inputCitiesFrom.addEventListener('input', () => {
    showCities(inputCitiesFrom, dropdownCitiesFrom);
});

// DD FROM
dropdownCitiesFrom.addEventListener('click', (event) => {
    handleDropdown(event, inputCitiesFrom, dropdownCitiesFrom);
});

//INPUT TO
inputCitiesTo.addEventListener('input', () => {
    showCities(inputCitiesTo, dropdownCitiesTo);
})

// DD TO
dropdownCitiesTo.addEventListener('click', (event) => {
    handleDropdown(event, inputCitiesTo, dropdownCitiesTo);
});

// заносим в city данные о городах 
getData(CITIES_API, (data) => {    
    city = JSON.parse(data).filter((item) => item.name);    
})

// домашнее задание - выводит в консоль информацию о рейсе Екатеринбург - Калининград на 25 мая
getData(CALENDAR_PRELOAD, (data) => {
    console.log(JSON.parse(data));
    
});