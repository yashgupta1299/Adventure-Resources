/* eslint-disable */
// import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const dataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');
const imageChange = document.querySelector('.form__upload');
const bookTourBTN = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(
        document.getElementById('map').dataset.locations
    );
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
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
