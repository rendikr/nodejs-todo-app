let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let helmet = require('helmet');
let path = require('path');
let bearerToken = require('express-bearer-token');
const db = require('../models');
const hbs = require('hbs')

let {User} = require( `${__base}/models` );
let Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
let httpStatus = require('http-status');
let bcrypt = require('bcrypt');
let response = require('../helpers/response');
let tokenHelper = require('../helpers/jwt');
let jwt = require('jsonwebtoken');

// Define paths for Express config
const assetsPath = path.join(__dirname, '../templates/assets')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

let routes = loadRoute('/routes');

/**
 * Express instance
 * @public
 */
let app = express();

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(assetsPath))

app.use(
    express.json({
        inflate: true,
        limit: '100mb',
        reviver: null,
        strict: false,
        type: 'application/form-data',
        verify: undefined,
    })
);

app.use(bearerToken());

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.options('*', cors());

db.sequelize.sync();

app.use(routes);

app.get('', (req, res) => {
    res.render('index', {
        title: 'Awards',
        author: 'Rendi K.'
    })
})

app.post('/sign-in', async (req, res) => {
    let data = req.body;

    let {error} = Joi.object().keys({
        email: Joi.string().email().rule({
            message: 'Incorrect email and/or password. Please try again.'
        }).required(),
        password: Joi.string().required()
    }).validate(data);

    if (error) {
        return response.JoiValidationError(req, res, error);
    }

    let user = await User.findOne({
        where: { email: data.email, deleted_at: { $eq: null }, is_deleted: { $eq: false } },
    });

    if (!user) {
        return response.responseJSON(req, res, httpStatus.UNAUTHORIZED, false, 'Email address is not exists.');
    }

    if (!user.is_active) {
        return response.responseJSON(req, res, httpStatus.UNAUTHORIZED, false, 'Your account is disabled, please contact the admin.');
    }

    if (!user.is_verified) {
        return response.responseJSON(req, res, httpStatus.UNAUTHORIZED, false, 'Your account is not activated, please contact the admin.');
    }

    if (!data.password) {
        return response.responseJSON(req, res, httpStatus.UNAUTHORIZED, false, 'Your account is not activated, please contact the admin.');
    }

    if (user && bcrypt.compareSync(data.password, user.get('password'))) {
        const getToken = await tokenHelper.generateToken(data.email);
        let token;

        if (getToken.status === 'success') token = getToken.token;
        else
            return response.responseJSON(req, res, httpStatus.UNPROCESSABLE_ENTITY, false, 'Generate token failed');

        data = {
            email: user.email,
            is_admin: user.is_admin
        }

        return response.responseJSON(req, res, httpStatus.OK, true, 'Login successfully', data, token);
    }

    return response.responseJSON(req, res, httpStatus.UNAUTHORIZED, false, 'Incorrect email and/or password. Please try again.');
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Tentang Saya',
        author: 'Rendi K.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found',
        author: 'Rendi K.'
    })
})

module.exports = app;
