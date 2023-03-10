const e = e => {
        mapboxgl.accessToken =
            'pk.eyJ1IjoieWFzaGd1cHRhMTExMSIsImEiOiJjbGNjZzB2ZDUyazhwM3d0OHF0ZnhtcmhkIn0.S93xXiysZdlPuelZHk1Wdw';
        var t = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/yashgupta1111/clcci2fmq002p14p2o4z1kvxy',
            scrollZoom: !1
        });
        const s = new mapboxgl.LngLatBounds();
        e.forEach(e => {
            const a = document.createElement('div');
            (a.className = 'marker'),
                new mapboxgl.Marker({ element: a, anchor: 'bottom' })
                    .setLngLat(e.coordinates)
                    .addTo(t),
                new mapboxgl.Popup({ offset: 30 })
                    .setLngLat(e.coordinates)
                    .setHTML(`<p>Day ${e.day}: ${e.description}</p>`)
                    .addTo(t),
                s.extend(e.coordinates);
        }),
            t.fitBounds(s, {
                padding: { top: 200, bottom: 150, left: 100, right: 100 }
            });
    },
    t = () => {
        const e = document.querySelector('.alert');
        e && e.parentElement.removeChild(e);
    },
    s = (e, s, a = 5) => {
        t();
        const o = `<div class="alert alert--${e}">${s}</div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', o),
            window.setTimeout(t, 1e3 * a);
    },
    a = 'https://adventure-authentication.up.railway.app',
    o = async (e, t) => {
        try {
            'success' ===
                (
                    await axios({
                        method: 'POST',
                        url: a + '/user/login',
                        data: { email: e, password: t },
                        withCredentials: !0
                    })
                ).data.status &&
                (s('success', 'Logged in successfully!'),
                window.setTimeout(() => {
                    location.assign('/');
                }, 1500));
        } catch (e) {
            s('error', e.response.data.message);
        }
    },
    n = async (e, t, a) => {
        try {
            'success' ===
                (
                    await axios({
                        method: 'POST',
                        url: '/api/v1/users/signup',
                        data: { name: e, password: t, passwordConfirm: a },
                        withCredentials: !0
                    })
                ).data.status &&
                (s('success', 'Signup successfull!'),
                window.setTimeout(() => {
                    location.assign('/login');
                }, 1500));
        } catch (e) {
            s('error', e.response.data.message);
        }
    },
    r = async (e, t) => {
        let a;
        try {
            const o =
                'password' === t
                    ? '/api/v1/users/updateMyPassword'
                    : '/api/v1/users/updateMe';
            if (
                ((a = await axios({ method: 'PATCH', url: o, data: e })),
                'success' === a.data.status)
            ) {
                if (
                    ('password' === t
                        ? (s(
                              'success',
                              `${t.toUpperCase()} updated successfully!`
                          ),
                          window.setTimeout(() => {
                              location.assign('/login');
                          }, 2500))
                        : s(
                              'success',
                              `${t.toUpperCase()} updated successfully!`
                          ),
                    'photo' === t)
                )
                    return a.data.data.updatedUser.photo;
                if ('data' === t) return a.data.data.updatedUser.name;
            }
        } catch (e) {
            s('error', e.response.data.message);
        }
    },
    d = async (e, t, a) => {
        let o;
        try {
            const n = '/api/v1/reviews';
            (o = await axios({
                method: 'POST',
                url: n,
                data: { review: t, rating: a, tour: e }
            })),
                'success' === o.data.status &&
                    (s('success', 'Review created successfully!'),
                    window.setTimeout(() => {
                        location.reload(!0);
                    }, 3e3));
        } catch (e) {
            s('error', e.response.data.message);
        }
    },
    c = async (e, t, a) => {
        let o;
        try {
            const n = '/api/v1/reviews/' + e;
            (o = await axios({
                method: 'PATCH',
                url: n,
                data: { review: t, rating: a }
            })),
                'success' === o.data.status &&
                    (s('success', 'Review updated successfully!'),
                    window.setTimeout(() => {
                        location.reload(!0);
                    }, 3e3));
        } catch (e) {
            s('error', e.response.data.message);
        }
    },
    u = async e => {
        let t;
        try {
            const a = '/api/v1/reviews/' + e;
            (t = await axios({ method: 'DELETE', url: a })),
                s('success', 'Review deleted successfully!'),
                window.setTimeout(() => {
                    location.reload(!0);
                }, 3e3);
        } catch (e) {
            s('error', e.response.data.message);
        }
    },
    i = async e => {
        try {
            const t = await axios(`/api/v1/bookings/checkout-session/${e}`);
            window.setTimeout(() => {
                location.assign(t.data.session.url);
            }, 100);
        } catch (e) {
            s('error', e),
                console.log(e),
                console.log(error.response.request._response);
        }
    },
    l = document.getElementById('map'),
    m = document.getElementById('review--form--create'),
    p = document.getElementById('review--form'),
    g = document.querySelectorAll('.review__delete'),
    w = document.querySelectorAll('.review__edit'),
    y = document.querySelector('.form--login'),
    v = document.querySelector('.form--signup'),
    f = document.querySelector('.nav__el--logout'),
    h = document.querySelector('.form-user-data'),
    E = document.querySelector('.form-user-password'),
    I = document.querySelector('.form__upload'),
    S = document.getElementById('book-tour'),
    B = document.querySelector('body').dataset.alert,
    b = document.getElementById('headerName'),
    T = window.location.search;
if (l) {
    e(JSON.parse(document.getElementById('map').dataset.locations));
}
if (
    (m &&
        m.addEventListener('submit', e => {
            e.preventDefault();
            const t = document.getElementById('review--form--create').dataset
                    .tourid,
                s = document.getElementById('review-create').value,
                a = document.getElementById('rating-create').value;
            d(t, s, a);
        }),
    p &&
        p.addEventListener('submit', e => {
            e.preventDefault();
            const t = document.getElementById('review--form').dataset.revid,
                s = document.getElementById('review').value,
                a = document.getElementById('rating').value;
            c(t, s, a);
        }),
    g &&
        g.forEach(e => {
            e.addEventListener('click', e => {
                e.preventDefault();
                const t = e.target.dataset.reviewid;
                u(t);
            });
        }),
    w &&
        w.forEach(e => {
            e.addEventListener('click', e => {
                e.preventDefault();
                const t = e.target.dataset.tourid;
                window.setTimeout(() => {
                    location.assign(t);
                }, 1500);
            });
        }),
    y &&
        y.addEventListener('submit', e => {
            e.preventDefault();
            const t = document.getElementById('email').value,
                s = document.getElementById('password').value;
            o(t, s);
        }),
    v &&
        v.addEventListener('submit', e => {
            e.preventDefault();
            const t = document.getElementById('name').value,
                s = document.getElementById('password').value,
                a = document.getElementById('passwordConfirm').value;
            n(t, s, a);
        }),
    f &&
        f.addEventListener('click', async () => {
            try {
                'success' ===
                    (
                        await axios({
                            method: 'GET',
                            url: '/api/v1/users/logout',
                            withCredentials: !0
                        })
                    ).data.status &&
                    (s('success', 'Logged out successfully!'),
                    window.setTimeout(() => {
                        location.assign('/');
                    }, 1500));
            } catch (e) {
                s('error', 'Error in logging out please try again!');
            }
        }),
    h &&
        h.addEventListener('submit', async e => {
            e.preventDefault();
            const t = document.getElementById('name').value,
                s = document.getElementById('email').value,
                a = await r({ name: t, email: s }, 'data');
            b.textContent = a;
        }),
    I &&
        I.addEventListener('change', async e => {
            e.preventDefault();
            const t = new FormData();
            t.append('photo', document.getElementById('photo').files[0]);
            const s = await r(t, 'photo');
            s &&
                (document
                    .querySelector('.nav__user-img')
                    .setAttribute('src', `/img/users/${s}`),
                document
                    .querySelector('.form__user-photo')
                    .setAttribute('src', `/img/users/${s}`));
        }),
    E &&
        E.addEventListener('submit', async e => {
            e.preventDefault(),
                (document.querySelector('.btn--save-password').textContent =
                    'updating..');
            const t = document.getElementById('password-current').value,
                s = document.getElementById('password').value,
                a = document.getElementById('password-confirm').value;
            await r(
                { currentPassword: t, password: s, passwordConfirm: a },
                'password'
            ),
                (document.querySelector('.btn--save-password').textContent =
                    'SAVE PASSWORD'),
                (document.getElementById('password-current').value = ''),
                (document.getElementById('password').value = ''),
                (document.getElementById('password-confirm').value = '');
        }),
    S &&
        S.addEventListener('click', e => {
            e.target.textContent = 'Processing...';
            const { tourId: t } = e.target.dataset;
            i(t);
        }),
    B && s('success', B, 20),
    T)
) {
    const e = new URLSearchParams(T),
        t = e.get('signUpName'),
        a = e.get('isPreviousSignup');
    t && (document.querySelector('.nameSignup').value = decodeURI(t)),
        'true' === a &&
            s(
                'success',
                'You have already done Sign up before. If you have not set the password yet then please fill the form',
                20
            );
}
(e => {
    let t = e + '=',
        s = document.cookie.split(';');
    for (let e = 0; e < s.length; e++) {
        let a = s[e];
        for (; ' ' == a.charAt(0); ) a = a.substring(1);
        if (0 == a.indexOf(t)) return a.substring(t.length, a.length);
    }
    return '';
})('tm') < Date.now() &&
    (async () => {
        try {
            await axios({
                method: 'GET',
                url: a + '/user/getAccessToken',
                withCredentials: !0
            });
        } catch (e) {}
    })();
//# sourceMappingURL=index.js.map
