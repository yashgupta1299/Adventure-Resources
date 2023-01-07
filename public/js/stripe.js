/* eslint-disable */
// import axios from 'axios';
// const stripe = Stripe(
// 'pk_test_51MMH1cSCFIFH28nc81LgT8gYmaByQwiw8WKJebkBQGl3AVj6PMnGWSCfOUuBIMZIZKIegfGGkndDnrbCGh7pt6pg00u2RrwCsD'
// );
import { showAlert } from './alerts';

export const bookTour = async tourId => {
    try {
        // get checkout session from API

        // by default get method in axios
        // console.log(tourId);
        const response = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );

        // await stripe.redirectToCheckout({
        //     sessionId: response.data.session.id
        // });

        // we can also use directly url as it is given in response no need of stripe.redirecto function
        window.setTimeout(() => {
            location.assign(response.data.session.url);
        }, 100);
    } catch (err) {
        showAlert('error', err);
        console.log(err);
        console.log(error.response.request._response);
    }
};
