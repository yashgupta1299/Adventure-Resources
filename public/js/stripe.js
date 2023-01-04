/* eslint-disable */
// import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
    'pk_test_51MMH1cSCFIFH28nc81LgT8gYmaByQwiw8WKJebkBQGl3AVj6PMnGWSCfOUuBIMZIZKIegfGGkndDnrbCGh7pt6pg00u2RrwCsD'
);

export const bookTour = async tourId => {
    try {
        // get checkout session from API

        // by default get method in axios
        const response = await axios(
            `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        );

        // await stripe.redirectToCheckout({
        // sessionId: response.data.session.id
        // });

        // we can also use directly url as it is given in response no need of stripe.redirecto function
        window.setTimeout(() => {
            location.assign(response.data.session.url);
        }, 1000);
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
