
var express = require('express');
var stormpath = require('express-stormpath');

var app = express();
app.set('views', './views');
app.set('view engine', 'jade');

var stormpathMiddleware = stormpath.init(app, {
  apiKeyFile: 'E:/cs/proj/bar/apikey.properties',
  application: 'https://api.stormpath.com/v1/applications/7O0IDZ5gcCeFbNw3qPrLVB',
  secretKey: 'aabuiauhaqh890890yq2askohnfg0q2384kzlzna981qekln12n3kjkb123n112354',
  expandCustomData: true,
  enableForgotPassword: true
});

app.use(stormpathMiddleware);

app.get('/', function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
});
console.log("starting to listen")
app.use('/profile',require('./profile')());
app.listen(3000);