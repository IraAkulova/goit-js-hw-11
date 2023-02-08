import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';


const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input'),
  btnEl: document.querySelector('.load-more'),
  divGallaryEl: document.querySelector('.gallery'),
};
const KEY = '33290430-0314363842258507589316bae';
const BASE_URL = 'https://pixabay.com/api';
let page = 0;
const perPage = 40;


refs.formEl.addEventListener('submit', onFormSubmit);
refs.btnEl.addEventListener('click', onFormSubmit);
refs.inputEl.addEventListener('input', onInputChange);


function onFormSubmit(e) {
    e.preventDefault();
    const searchQuery = refs.inputEl.value;
    fetchQuery(searchQuery);
}

async function fetchQuery(query) {
    page += 1;
    const imgs = await axios.get(`${BASE_URL}/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    refs.divGallaryEl.insertAdjacentHTML('beforeend', createMarkup(imgs));
};

function createMarkup(imgs) {
    const array = imgs.data.hits;
    if (array.length > 0) {
        refs.btnEl.classList.add('btn-is-shown')
    };   
    const string = array
        .map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads,}) => {
        return `<div class="photo-card">
            <div class="photo">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" class="image" loading="lazy" />
            </a></div>
            <div class="info">
            <p class="info-item">
            <b>Likes</b>
            ${likes}
            </p>
            <p class="info-item">
            <b>Views</b>
            ${views}
            </p>
            <p class="info-item">
            <b>Comments</b>
            ${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
            ${downloads}
            </p>
            </div>
            </div>`;})
            .join('');
        if (array.length === 0) {
            refs.divGallaryEl.innerHTML = '';
            Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`)
        } else if (page * perPage > imgs.data.totalHits) {
            Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
        } else {
            renderMarkUp(string);
        } 
};

function renderMarkUp(markUp) {
    refs.divGallaryEl.insertAdjacentHTML('beforeend', markUp);
    
    new SimpleLightbox('.gallery a').refresh();
};

function onInputChange(e) {
    if (e.currentTarget.value !== refs.inputEl.textContent) {
        refs.divGallaryEl.innerHTML = '';
        page = 0;
    }
};
