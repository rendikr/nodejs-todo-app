let express = require('express');

// routes
let router = express.Router();
let userRoutes = loadRoute('user/user');

let jwtMiddleware = loadMiddleware('/jwt');
let userMiddleware = loadMiddleware('/user');

router.use('/user', [jwtMiddleware.checkToken, userMiddleware.isActiveUser], userRoutes);

module.exports = router;
