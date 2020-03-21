const formSearch = document.querySelector(".form-search"),
        inputCitiesFrom = document.querySelector(".input__cities-from"),
        dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"),
        inputCitiesTo = document.querySelector(".input__cities-to")
        dropdownCitiesTo = document.querySelector(".dropdown__cities-to"),
        inputDateDepart = document.querySelector(".input__date-depart");
        inputDateDepart = formSearch.querySelector('.input__date-depart'),
        cheapestTicket = document.getElementById('cheapest-ticket'),
        otherCheapTickets = document.getElementById('other-cheap-tickets');

const CITIES_API = './data/cities.json'; //'http://api.travelpayouts.com/data/ru/cities.json';
const PROXY = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = '04ce4107846b4638e05f5cfbd3fa3115'; 
const CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload';

//const CALENDAR_PRELOAD = CALENDAR + `?origin=${FROM}&destination=${TO}&depart_date=${WHEN}&one_way=true` // строка запроса

let city = [];

const MAX_TICKETS_COUNT = 10;

// получает данные и обрабатывает их в callback
const getData = (url, callback, errorCallback = console.error) => {
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
            errorCallback(request.status);
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
        item.name.toLowerCase().startsWith(input.value.toLowerCase())
    );

    // создаем DD
    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city')
        li.textContent = item.name;
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


const getLinkTicket = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);
    const day = date.getDate();
    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;
    link += month < 10 ? '0' + month : month;

    link += data.destination;
    link += '1';

    return link;
};

const getNameCity = (code) => {
    const objCity = city.find(item => item.code === code);
    return objCity.name;
};

const getViewDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const getChanges = (num) => {
    if (num) return num === 1 ? 'С одной пересадкой' : 'Две и более пересадок';
    else return 'Без пересадок';
};

const showMessage = (textMessage) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.style.color = 'red';
    cheapestTicket.innerHTML = '<h3>' + textMessage + '</h3>';
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="${getLinkTicket(data)}" target="_blank" class="button button__buy">Купить
                        за ${data.value}₽</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">Вылет из города
                            <span class="city__name">${getNameCity(data.origin)}</span>
                        </div>
                        <div class="date">${getViewDate(data.depart_date)}</div>
                    </div>
            
                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="city__to">Город назначения:
                            <span class="city__name">${getNameCity(data.destination)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

// самый дешевый билет на дату
const renderSearchDay = (cheapTicketDay) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

    if (cheapTicketDay.length) {
        const ticket = createCard(cheapTicketDay[0]);
        cheapestTicket.append(ticket);
    } else {
        cheapestTicket.insertAdjacentHTML('beforeend', '<h3>На выбранную дату билеты отсутствуют.</h3>');
    }
};

// самые дешевые на другие даты
const renderSearchPeriod = (tickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    tickets.sort((a, b) => a.value - b.value);

    for (let i = 0; i < tickets.length && i < MAX_TICKET; i++) {
        const ticket = createCard(tickets[i]);
        otherCheapTickets.append(ticket);
    }
};

const renderCheap = (data, needDate) => {
    const tickets = JSON.parse(data).best_prices;

    if (tickets.length) {
        const cheapTicketDay = tickets.filter(item => item.depart_date === needDate);

        renderSearchDay(cheapTicketDay);
        renderSearchPeriod(tickets);
    }
};

// закрывает Dd после клика на вне его самого
document.body.addEventListener('click', () => {
    dropdownCitiesFrom.textContent = '';
    dropdownCitiesTo.textContent = '';
});

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

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name),
        to: city.find((item) => inputCitiesTo.value === item.name),
        when: inputDateDepart.value
    }

    if (formData.from && formData.to) {

        const requestData = '?depart_date' + formSearch.when +
            '&origin=' + formData.from.code + 
            '&destination=' + formData.to.code + 
            '&one_way=true';
        
        getData(CALENDAR + requestData, (response) => {
            renderCheap(response, formData.when)
        },
        (err) => {
            showMessage('В этом направлении нет рейсов');
            console.error('Произошла ошибка', err)
        });
    }else 
        showMessage('Введите корректно город');

});

// заносим в city данные о городах 
getData(CITIES_API, (data) => {    
    city = JSON.parse(data).filter((item) => item.name);  
    city.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name ? -1 : 0));  
})
