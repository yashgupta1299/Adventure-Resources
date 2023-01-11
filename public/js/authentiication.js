/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';

// const urlDomain = '';
const urlDomain = 'https://adventure.authentication.up.railway.app';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: urlDomain + '/user/login',
            data: {
                email,
                password
            },
            withCredentials: true
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
export const getCookie = cname => {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};

export const getAccessToken = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: urlDomain + '/user/getAccessToken',
            withCredentials: true
        });
    } catch (err) {}
};

export const signup = async (name, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                password,
                passwordConfirm
            },
            withCredentials: true
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Signup successfull!');
            window.setTimeout(() => {
                location.assign('/login');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
            withCredentials: true
        });
        if (res.data.status === 'success') {
            // location.reload(true);

            // my
            showAlert('success', 'Logged out successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', 'Error in logging out please try again!');
    }
};
