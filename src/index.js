import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from "./js/fetchCountries";

const DEBOUNCE_DELAY = 300;
const input = document.querySelector(`#search-box`);
const list = document.querySelector(`.country-list`);

input.addEventListener(`input`, debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  event.preventDefault();
    const countryName = event.target.value;
    if (!event.target.value) {
        list.innerHTML = ``;
        return;
    }
    fetchCountries(countryName)
      .then(data => (checkName(data)))
      .catch(err => Notiflix.Notify.failure('Oops, there is no country with that name'));
    
}


function checkName(data) {
    if (data.length < 2) {
       list.innerHTML = createMainMarkup(data);
    }
    else if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
    }
    else {
       list.innerHTML = createSecondaryMarkup(data);
    }
}

function createMainMarkup(data) {
  return data
    .map(
      ({
        capital,
        flags: { svg },
        languages,
        name: { official },
        population,
      }) =>
        `<li style="list-style: none">
  <div style="display: flex"><img src="${svg}" alt="${official}" width="100px">
<h2 style="padding-left: 10px">${official}</h2></div>
<p>Capital: ${capital}</p>
<p>Population: ${population}</p>
<p>Languages: ${Object.values(languages).join(`, `)}</p>
</li>`
    )
    .join(``);
}

function createSecondaryMarkup(data) {
  return data
    .map(
      ({ flags: { svg }, name: { official } }) =>
        `<li style="list-style: none; padding: 10px">
  <div style="display: flex"><img src="${svg}" alt="${official}" width="100px">
<h2 style="padding-left: 10px">${official}</h2></div></li>`
    )
    .join(``);
}
