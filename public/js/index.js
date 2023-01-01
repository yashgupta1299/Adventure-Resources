/* eslint-disable */
// import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const dataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');

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

if (dataForm) {
    dataForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({ name, email }, 'data');
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
