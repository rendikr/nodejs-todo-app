let httpStatus = require('http-status');
let response = require('../helpers/response');

exports.isActiveUser = (req, res, next) => {
    let user = req.authUser;

    if (!user.is_verified || !user.is_active) {
        return response.responseJSON(req, res, httpStatus.UNPROCESSABLE_ENTITY, false, 'Forbidden access, user is not verified');
    }

    return next();
};
