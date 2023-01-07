/* eslint-disable */
// import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, signup } from './login';
import {
    updateSettings,
    reviewCreate,
    reviewUpdate,
    reviewDelete
} from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM Elements
const mapBox = document.getElementById('map');
const reviewFormCreate = document.getElementById('review--form--create');
const reviewForm = document.getElementById('review--form');
const reviewDeleteBtns = document.querySelectorAll('.review__delete');
const reviewChangeBtns = document.querySelectorAll('.review__edit');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.nav__el--logout');
const dataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');
const imageChange = document.querySelector('.form__upload');
const bookTourBTN = document.getElementById('book-tour');
const headAlertDataset = document.querySelector('body').dataset.alert;
const queryString = window.location.search;

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(
        document.getElementById('map').dataset.locations
    );
    displayMap(locations);
}
if (reviewFormCreate) {
    reviewFormCreate.addEventListener('submit', event => {
        event.preventDefault();
        const tourid = document.getElementById('review--form--create').dataset
            .tourid;
        const review = document.getElementById('review-create').value;
        const rating = document.getElementById('rating-create').value;
        reviewCreate(tourid, review, rating);
    });
}
if (reviewForm) {
    reviewForm.addEventListener('submit', event => {
        event.preventDefault();
        const revid = document.getElementById('review--form').dataset.revid;
        const review = document.getElementById('review').value;
        const rating = document.getElementById('rating').value;
        reviewUpdate(revid, review, rating);
    });
}
if (reviewDeleteBtns) {
    reviewDeleteBtns.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            // `event.target` refers to the button that was clicked
            const reviewid = event.target.dataset.reviewid;
            reviewDelete(reviewid);
        });
    });
}
if (reviewChangeBtns) {
    reviewChangeBtns.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            // `event.target` refers to the button that was clicked
            const tourid = event.target.dataset.tourid;
            window.setTimeout(() => {
                location.assign(tourid);
            }, 1500);
        });
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}
if (signupForm) {
    signupForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm')
            .value;
        signup(name, password, passwordConfirm);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// without photo
if (dataForm) {
    dataForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({ name, email }, 'data');
    });
}

// with photo and all data submit at once i.e name email photo
//hence need to create form data object no need to change updateSettings
// if (dataForm) {
//     dataForm.addEventListener('submit', event => {
//         event.preventDefault();
//         const form = new FormData();
//         form.append('name', document.getElementById('name').value);
//         form.append('email', document.getElementById('email').value);
//         form.append('photo', document.getElementById('photo').files[0]);
//         updateSettings(form, 'data');
//     });
// };

if (imageChange) {
    imageChange.addEventListener('change', async event => {
        event.preventDefault();
        const form = new FormData();
        form.append('photo', document.getElementById('photo').files[0]);

        const newUserPhotoName = await updateSettings(form, 'photo');
        if (newUserPhotoName) {
            document
                .querySelector('.nav__user-img')
                .setAttribute('src', `/img/users/${newUserPhotoName}`);
            document
                .querySelector('.form__user-photo')
                .setAttribute('src', `/img/users/${newUserPhotoName}`);
        }
    });
}

if (passwordForm) {
    passwordForm.addEventListener('submit', async event => {
        event.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'updating..';

        const currentPassword = document.getElementById('password-current')
            .value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm')
            .value;
        await updateSettings(
            { currentPassword, password, passwordConfirm },
            'password'
        );

        document.querySelector('.btn--save-password').textContent =
            'SAVE PASSWORD';

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if (bookTourBTN) {
    bookTourBTN.addEventListener('click', event => {
        event.target.textContent = 'Processing...';
        // all can work same
        // const tourId = document.getElementById('book-tour').dataset.tourId;
        // const tourId = event.target.dataset.tourId;
        const { tourId } = event.target.dataset; // destructuring way
        bookTour(tourId);
    });
}

if (headAlertDataset) {
    showAlert('success', headAlertDataset, 20);
}

if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    if (email) {
        document.getElementById('emailSignUP').value = email;
    }
    console.log(name);
    if (name) {
        document.querySelector('.nameSignup').value = name
            .split('%20')
            .join(' ');
    }
}
