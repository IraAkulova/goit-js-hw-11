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
let lightbox = new SimpleLightbox('.gallery a');


refs.formEl.addEventListener('submit', onFormSubmit);
refs.btnEl.addEventListener('click', onLoadMoreBtnClick);
refs.inputEl.addEventListener('input', onInputChange);


async function onFormSubmit(e) {
    e.preventDefault();
    const searchQuery = refs.inputEl.value;
    const { hits } = await fetchQuery(searchQuery);
    if (hits.length === 0) {
        refs.divGallaryEl.innerHTML = '';
        Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        return;}
    renderMarkUp(hits);
    refs.btnEl.classList.add('btn-is-shown');
    lightbox.refresh();
}

function onInputChange(e) {
    if (e.currentTarget.value !== refs.inputEl.textContent || e.currentTarget.value === '' ) {
        refs.divGallaryEl.innerHTML = '';
        page = 0;
        refs.btnEl.classList.remove('btn-is-shown');
    } 
};

async function onLoadMoreBtnClick() {
    const { hits, totalHits } = await fetchQuery(refs.inputEl.value);
    if (page * perPage > totalHits) {
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
        return;}
    renderMarkUp(hits);
    lightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found another ${hits.length} images.`);

    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};

async function fetchQuery(query) {
    page += 1;
    const {data} = await axios.get(`${BASE_URL}/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    return data;
};

function renderMarkUp(imgs) { 
    const string = imgs
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
        refs.divGallaryEl.insertAdjacentHTML('beforeend', string);
};



