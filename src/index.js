import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input'),
  btnEl: document.querySelector('button'),
  divGallaryEl: document.querySelector('.gallery'),
};
const KEY = '33290430-0314363842258507589316bae';
const BASE_URL = 'https://pixabay.com/api';

refs.formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
    e.preventDefault();
    const searchQuery = refs.inputEl.value;
    fetchQuery(searchQuery);
}

async function fetchQuery(query) {
    const imgs = await axios.get(`${BASE_URL}/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`);
    refs.divGallaryEl.innerHTML = createMarkup(imgs);
};

async function createMarkup(imgs) {
    try {const array = await imgs.data.hits;
        console.log(imgs);
        const string = await array
                .map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads,
                    }) => {return `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
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
        } else {
            renderMarkUp(string);
        }
    } catch (error) {
        console.log(error);
    }
};

function renderMarkUp(markUp) {
    refs.divGallaryEl.innerHTML = markUp;
};

