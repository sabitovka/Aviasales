const formSearch = document.querySelector(".form-search"),
        inputCitiesFrom = document.querySelector(".input__cities-from"),
        dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"),
        inputCitiesTo = document.querySelector(".input__cities-to")
        dropdownCitiesTo = document.querySelector(".dropdown__cities-to"),
        inputDateDepart = document.querySelector(".input__date-depart");

const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск',
    'Керчь', 'Волгоград', 'Самара', 'Днепр', 'Екатеринбург', 'Одесса', 
    'Ухань', 'Калининград', 'Нижний Новгород', 'Вроцлав', 'Ростов-на-Дону'];

const showCities = (input, list) => {
    list.textContent = '';

    // если в инпуте пусто - ничего не надо показывать
    if (input.value === '') return;
    // фильруем по вхождению из инпута
    const filterCity = city.filter((item) => {
        return item.toLowerCase().includes(input.value.toLowerCase());
    });

    // создаем DD
    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city')
        li.textContent = item;
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

inputCitiesFrom.addEventListener('input', () => {
    showCities(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    handleDropdown(event, inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showCities(inputCitiesTo, dropdownCitiesTo);
})

dropdownCitiesTo.addEventListener('click', (event) => {
    handleDropdown(event, inputCitiesTo, dropdownCitiesTo);
});