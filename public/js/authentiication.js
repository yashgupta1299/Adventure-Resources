/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';

// const urlDomain = '';
const urlDomain = 'http://127.0.0.1:3000';

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
            console.log(res);
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const signup = async (name, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: urlDomain + '/user/signup',
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
                location.assign('/');
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
            url: urlDomain + '/user/logout',
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
