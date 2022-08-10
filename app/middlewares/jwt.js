let jwt = require('jsonwebtoken');
let {User, UserRole, UserGroup, RoleAccess, MenuAccess} = require( `${__base}/models` );

let httpStatus = require('http-status');
let response = require('../helpers/response');

require('dotenv').config();

exports.checkToken = async function(req, res, next) {
    let token = req.query.token;

    if (!token) {
        token = req.token;
        if (!token) {
            return response.responseJSON(req, res, httpStatus.UNPROCESSABLE_ENTITY, false, 'Token required');
        }
    }

    let decodeToken = jwt.decode(token, { complete: true });
    let checkUser = await User.findOne({
        where: { email: decodeToken.payload.email, is_verified: true, is_active: true, is_deleted: false, deleted_at: null },
    });

    if (!checkUser)
        return response.responseJSON(req, res, httpStatus.UNPROCESSABLE_ENTITY, false, 'Forbidden access');

    jwt.verify(token, process.env.JWT_TOKEN_KEY, async function(err, decoded) {
        if (err) {
            return response.responseJSON(req, res, httpStatus.UNPROCESSABLE_ENTITY, false, err.message);
        }

        await jwt.verify(decodeToken.payload.refreshToken, process.env.JWT_REFRESH_KEY, function(err, decoded) {
            if (err) {
                return response.responseJSON(req, res, httpStatus.UNPROCESSABLE_ENTITY, false, err.message);
            }
        });

        req.authUser = checkUser;
        return next();
    });
}
