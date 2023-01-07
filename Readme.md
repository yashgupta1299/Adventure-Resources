# Adventure Tour Web Application

### [Live App Demo](https://adventure.up.railway.app/)

<hr />

### A Adventure Tour booking website with following Techstack

> -   NodeJS and ExpressJS
> -   MongoDB and Mongoose
> -   PUG JavaScript and CSS

### Models and Architectureof the Web App

> -   Utilized Node, Express, and Mongoose to construct the REST API.
> -   PUG is the view engine on this server-side rendered website.
> -   Additionally, WebApp uses the Model-View-Controller (MVC) architecture.

### Modules and methods used for Security purpose

```javascript
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');
```

> -   JWTs or JSON Web Tokens are used to identify authenticated user with expiration time.
> -   Implimented Google OAuth 2.0 to verify user identity on signup and forgot password routes
> -   BCrypt Algorithm is used to hash and salt passwords securely before saving them in a database.
> -   Cross-Origin Resource Sharing (CORS) is used which is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.
> -   Rate limiting prevents the same IP address from making too many requests that will help us prevent attacks like brute force.
> -   Mongo Sanitize is used which sanitizes user-supplied data to prevent MongoDB Operator Injection
> -   XSS module prevent Cross-site scripting (XSS) attacks.
> -   hpp module used to prevent HTTP Parameter Pollution (HPP).
> -   Helmet helps you secure your Express.js apps by setting various HTTP headers.
> -   A complete and secure payment system is implimented with Stripe webhooks.

### Features of the Web App

> -   Email facility after successful signup for uploading user photo and collecting user-data with SendGrid and nodemailer.
> -   User can book a tour with real time payments with credit or debit card
> -   Admin can perform create, edit and delete operations for a tour, review, booking or a user.
> -   Compression of data and user photos implimented using multer.
> -   User can create, edit and delete a review for a tour which was purchased by him.
> -   User can update his profile settings including passwords.
