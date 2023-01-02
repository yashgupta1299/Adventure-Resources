/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';

// type can be password or data
export const updateSettings = async (data, type) => {
    let res;
    try {
        const url =
            type === 'password'
                ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
                : 'http://127.0.0.1:3000/api/v1/users/updateMe';

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
        showAlert('errror', err.response.data.message);
    }
};
