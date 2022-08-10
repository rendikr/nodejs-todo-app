let express = require('express');

// routes
let router = express.Router();
let awardRoutes = loadRoute('todo/award');

let jwtMiddleware = loadMiddleware('/jwt');
let userMiddleware = loadMiddleware('/user');

router.use('/todo', [jwtMiddleware.checkToken, userMiddleware.isActiveUser], awardRoutes);

module.exports = router;
