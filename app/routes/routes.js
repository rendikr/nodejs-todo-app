let express = require('express');
let { apiVersion } = require('../config/config');
let path = require("path");

// routes
let authRoutes = loadRoute('auth/auth');
let todoRoutes = loadRoute('todo/index');
let userRoutes = loadRoute('user/index');

let router = express.Router();

router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

router.use('/', (req, res) => {
    res.render('index', {
        title: 'To Do App',
        author: 'Rendi K.'
    })
}); // localhost:9005
router.use('/auth', authRoutes);
router.use('/todo', todoRoutes);
router.use('/user', userRoutes);

router.get('/assets/:type/:folder/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, "../../assets/" + req.params.type + '/' + req.params.folder + '/' + req.params.filename));
});

module.exports = router;
