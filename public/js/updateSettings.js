/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';

// type can be password or data
export const updateSettings = async (data, type) => {
    let res;
    try {
        const url =
            type === 'password'
                ? '/api/v1/users/updateMyPassword'
                : '/api/v1/users/updateMe';

        res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
            if (type === 'photo') {
                // note return also goes to catch block hence handle that case also
                return res.data.data.updatedUser.photo;
            }
        }
    } catch (err) {
        if (type === 'photo' && res.data.status === 'success') {
            return;
        }
        showAlert('error', err.response.data.message);
    }
};

export const reviewCreate = async (tour, review, rating) => {
    // tour is tourId here
    let res;
    try {
        const url = '/api/v1/reviews';
        res = await axios({
            method: 'POST',
            url,
            data: {
                review,
                rating,
                tour
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', `Review created successfully!`);
            location.reload(true);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
export const reviewUpdate = async (revId, review, rating) => {
    let res;
    try {
        const url = '/api/v1/reviews/' + revId;
        res = await axios({
            method: 'PATCH',
            url,
            data: {
                review,
                rating
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', `Review updated successfully!`);
            // location.reload(true);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const reviewDelete = async reviewid => {
    let res;
    try {
        const url = '/api/v1/reviews/' + reviewid;
        res = await axios({
            method: 'DELETE',
            url
        });
        // showAlert('success', `Review deleted successfully!`);
        location.reload(true);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
