/* eslint-disable */
import { showAlert } from './alerts';

// type can be password or data(in data there is name only) or photo
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
            if (type === 'password') {
                showAlert(
                    'success',
                    `${type.toUpperCase()} updated successfully!`
                );
                window.setTimeout(() => {
                    location.assign('/login');
                }, 2500);
            } else {
                // if we are reloading window then there is no need to update the name in js in index but
                // that functionaly is still function for demo or test purpose
                window.setTimeout(() => {
                    location.reload(true);
                }, 10);
                showAlert(
                    'success',
                    `${type.toUpperCase()} updated successfully!`
                );
            }

            if (type === 'photo') {
                return res.data.data.updatedUser.photo;
            }
            if (type === 'data') {
                return res.data.data.updatedUser.name;
            }
        }
    } catch (err) {
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
            window.setTimeout(() => {
                location.reload(true);
            }, 3000);
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
            window.setTimeout(() => {
                location.reload(true);
            }, 3000);
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
        showAlert('success', `Review deleted successfully!`);
        window.setTimeout(() => {
            location.reload(true);
        }, 3000);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
