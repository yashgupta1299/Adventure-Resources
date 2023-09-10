/* eslint-disable */// import '@babel/polyfill';
/* eslint-disable *//* eslint-disable */// import axios from 'axios';
/* eslint-disable */const e=()=>{let e=document.querySelector(".alert");e&&e.parentElement.removeChild(e)},t=(t,a,s=5)=>{e();let o=`<div class="alert alert--${t}">${a}</div>`;document.querySelector("body").insertAdjacentHTML("afterbegin",o),window.setTimeout(e,1e3*s)},a="https://adventure-authentication.up.railway.app",s=async(e,s)=>{try{let o=await axios({method:"POST",url:a+"/user/login",data:{email:e,password:s},withCredentials:!0});"success"===o.data.status&&(t("success","Logged in successfully!"),window.setTimeout(()=>{location.assign("/")},1500))}catch(e){t("error",e.response.data.message)}},o=async()=>{try{await axios({method:"GET",url:a+"/user/getAccessToken",withCredentials:!0})}catch(e){}},r=async(e,a,s)=>{try{let o=await axios({method:"POST",url:"/api/v1/users/signup",data:{name:e,password:a,passwordConfirm:s},withCredentials:!0});"success"===o.data.status&&(t("success","Signup successfull!"),window.setTimeout(()=>{location.assign("/login")},1500))}catch(e){t("error",e.response.data.message)}},n=async()=>{try{let e=await axios({method:"GET",url:"/api/v1/users/logout",withCredentials:!0});"success"===e.data.status&&(t("success","Logged out successfully!"),window.setTimeout(()=>{location.assign("/")},1500))}catch(e){t("error","Error in logging out please try again!")}},d=async(e,a)=>{let s;try{if(s=await axios({method:"PATCH",url:"password"===a?"/api/v1/users/updateMyPassword":"/api/v1/users/updateMe",data:e}),"success"===s.data.status){if("password"===a?(t("success",`${a.toUpperCase()} updated successfully!`),window.setTimeout(()=>{location.assign("/login")},2500)):(// if we are reloading window then there is no need to update the name in js in index but
// that functionaly is still function for demo or test purpose
window.setTimeout(()=>{location.reload(!0)},10),t("success",`${a.toUpperCase()} updated successfully!`)),"photo"===a)return s.data.data.updatedUser.photo;if("data"===a)return s.data.data.updatedUser.name}}catch(e){t("error",e.response.data.message)}},u=async(e,a,s)=>{// tour is tourId here
let o;try{o=await axios({method:"POST",url:"/api/v1/reviews",data:{review:a,rating:s,tour:e}}),"success"===o.data.status&&(t("success","Review created successfully!"),window.setTimeout(()=>{location.reload(!0)},3e3))}catch(e){t("error",e.response.data.message)}},c=async(e,a,s)=>{let o;try{o=await axios({method:"PATCH",url:"/api/v1/reviews/"+e,data:{review:a,rating:s}}),"success"===o.data.status&&(t("success","Review updated successfully!"),window.setTimeout(()=>{location.reload(!0)},3e3))}catch(e){t("error",e.response.data.message)}},l=async e=>{try{await axios({method:"DELETE",url:"/api/v1/reviews/"+e}),t("success","Review deleted successfully!"),window.setTimeout(()=>{location.reload(!0)},3e3)}catch(e){t("error",e.response.data.message)}},i=async e=>{try{// get checkout session from API
// by default get method in axios
// console.log(tourId);
let t=await axios(`/api/v1/bookings/checkout-session/${e}`);// await stripe.redirectToCheckout({
//     sessionId: response.data.session.id
// });
// we can also use directly url as it is given in response no need of stripe.redirecto function
window.setTimeout(()=>{location.assign(t.data.session.url)},100)}catch(e){t("error",e),console.log(e),console.log(error.response.request._response)}},m=document.getElementById("map"),p=document.getElementById("review--form--create"),g=document.getElementById("review--form"),w=document.querySelectorAll(".review__delete"),y=document.querySelectorAll(".review__edit"),v=document.querySelector(".form--login"),f=document.querySelector(".form--signup"),h=document.querySelector(".nav__el--logout"),E=document.querySelector(".form-user-data"),I=document.querySelector(".form-user-password"),S=document.querySelector(".form__upload"),B=document.getElementById("book-tour"),b=document.querySelector("body").dataset.alert,T=document.getElementById("headerName"),x=window.location.search;// DELEGATION
if(m){let e=JSON.parse(document.getElementById("map").dataset.locations);(e=>{mapboxgl.accessToken="pk.eyJ1IjoieWFzaGd1cHRhMTExMSIsImEiOiJjbGNjZzB2ZDUyazhwM3d0OHF0ZnhtcmhkIn0.S93xXiysZdlPuelZHk1Wdw";var t=new mapboxgl.Map({container:"map",style:"mapbox://styles/yashgupta1111/clcci2fmq002p14p2o4z1kvxy",scrollZoom:!1});let a=new mapboxgl.LngLatBounds;e.forEach(e=>{// Create marker
let s=document.createElement("div");s.className="marker",// Add marker
new mapboxgl.Marker({element:s,anchor:"bottom"}).setLngLat(e.coordinates).addTo(t),// Add popup
new mapboxgl.Popup({offset:30}).setLngLat(e.coordinates).setHTML(`<p>Day ${e.day}: ${e.description}</p>`).addTo(t),// Extend map bounds to include current location
a.extend(e.coordinates)}),t.fitBounds(a,{padding:{top:200,bottom:150,left:100,right:100}})})(e)}if(p&&p.addEventListener("submit",e=>{e.preventDefault();let t=document.getElementById("review--form--create").dataset.tourid,a=document.getElementById("review-create").value,s=document.getElementById("rating-create").value;u(t,a,s)}),g&&g.addEventListener("submit",e=>{e.preventDefault();let t=document.getElementById("review--form").dataset.revid,a=document.getElementById("review").value,s=document.getElementById("rating").value;c(t,a,s)}),w&&w.forEach(e=>{e.addEventListener("click",e=>{e.preventDefault();// `event.target` refers to the button that was clicked
let t=e.target.dataset.reviewid;l(t)})}),y&&y.forEach(e=>{e.addEventListener("click",e=>{e.preventDefault();// `event.target` refers to the button that was clicked
let t=e.target.dataset.tourid;window.setTimeout(()=>{location.assign(t)},1500)})}),v&&v.addEventListener("submit",e=>{e.preventDefault();let t=document.getElementById("email").value,a=document.getElementById("password").value;s(t,a)}),f&&f.addEventListener("submit",e=>{e.preventDefault();let t=document.getElementById("name").value,a=document.getElementById("password").value,s=document.getElementById("passwordConfirm").value;r(t,a,s)}),h&&h.addEventListener("click",n),E&&E.addEventListener("submit",async e=>{e.preventDefault();let t=document.getElementById("name").value,a=document.getElementById("email").value,s=await d({name:t,email:a},"data");T.textContent=s}),S&&S.addEventListener("change",async e=>{e.preventDefault();let t=new FormData;t.append("photo",document.getElementById("photo").files[0]);let a=await d(t,"photo");a&&(a.startsWith("https")?(document.querySelector(".nav__user-img").setAttribute("src",`${a}`),document.querySelector(".form__user-photo").setAttribute("src",`${a}`)):(document.querySelector(".nav__user-img").setAttribute("src",`/img/users/${a}`),document.querySelector(".form__user-photo").setAttribute("src",`/img/users/${a}`)))}),I&&I.addEventListener("submit",async e=>{e.preventDefault(),document.querySelector(".btn--save-password").textContent="updating..";let t=document.getElementById("password-current").value,a=document.getElementById("password").value,s=document.getElementById("password-confirm").value;await d({currentPassword:t,password:a,passwordConfirm:s},"password"),document.querySelector(".btn--save-password").textContent="SAVE PASSWORD",document.getElementById("password-current").value="",document.getElementById("password").value="",document.getElementById("password-confirm").value=""}),B&&B.addEventListener("click",e=>{e.target.textContent="Processing...";// all can work same
// const tourId = document.getElementById('book-tour').dataset.tourId;
// const tourId = event.target.dataset.tourId;
let{tourId:t}=e.target.dataset;// destructuring way
i(t)}),b&&t("success",b,20),x){let e=new URLSearchParams(x),a=e.get("signUpName"),s=e.get("isPreviousSignup"),o=e.get("alert");a&&(document.querySelector(".nameSignup").value=decodeURI(a)),"true"===s&&t("success","Please Set Your Password!",20),o&&t("error",o,20)}(e=>{let t=document.cookie.split(";");for(let e=0;e<t.length;e++){let a=t[e];for(;" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf("tm="))return a.substring(3,a.length)}return""})(0)<Date.now()&&o();//# sourceMappingURL=index.js.map

//# sourceMappingURL=index.js.map
