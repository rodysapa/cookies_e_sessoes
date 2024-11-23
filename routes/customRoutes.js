
var express = require('express');
var router = express.Router();

// Home route: render form for user name
router.get('/', function(req, res) {
    res.render('index', { user: req.session.user || '' });
});

// Save user name in session
router.post('/salvauser', function(req, res) {
    req.session.user = req.body.name;
    res.redirect('/');
});

// Random number route: manage in cookies
router.get('/random', function(req, res) {
    let randomNumber = req.cookies.random || Math.floor(Math.random() * 100);
    res.cookie('random', randomNumber);
    res.send(`Random number: ${randomNumber}`);
});

// Access counter route
router.get('/contador', function(req, res) {
    req.session.userCount = (req.session.userCount || 0) + 1;
    req.app.locals.globalCount = (req.app.locals.globalCount || 0) + 1;

    res.send(`User count: ${req.session.userCount}, Global count: ${req.app.locals.globalCount}`);
});

module.exports = router;
