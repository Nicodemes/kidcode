
var stormpath = require('stormpath');

var express = require('express');
var express_stormpath = require('express-stormpath');

var forms = require('forms');
var csurf = require('csurf');
var collectFormErrors = require('express-stormpath/lib/helpers').collectFormErrors;
var extend = require('xtend');
// In this example, we'll reference the API credentials from environment
// variables (*NEVER HARDCODE API KEY VALUES IN SOURCE CODE!*).
var apiKey = new stormpath.ApiKey(
  "39THZC866Z2JQQG22AM2GMQZI",
  "pmJmvY8psYyImrkQDwsiMSM+WmmKtfXgavwsuHrmgC0"
);
var client = new stormpath.Client({apiKey: apiKey});



client.getDirectory("https://api.stormpath.com/v1/directories/7O0MXcNry77SZuMCDNfBDl", {expand: 'accounts'}, function(err, dir) {
  	dir.getAccounts({username: 'thetimea64@gmail.com'}, function(err, accounts) {
	    accounts.each(function(account, callback) {
		    account.getCustomData(function(err, customData) {
	  			console.log(customData);
	  			callback()
			});		
	 	 });
	});
});

//--------------------------------------------

var app = express();
app.set('views', './views');
app.set('view engine', 'jade');

var stormpathMiddleware = express_stormpath.init(app, {
  apiKeyFile: 'E:/cs/proj/bar/apikey.properties',
  application: 'https://api.stormpath.com/v1/applications/7O0IDZ5gcCeFbNw3qPrLVB',
  secretKey: 'aabuiauhaqh890890yq2askohnfg0q2384kzlzna981qekln12n3kjkb123n112354',
  expandCustomData: true,
  enableForgotPassword: true,
  enableUsername: true,
});

app.use(stormpathMiddleware);

app.get('/', function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
});
//-----------------------------------
var profileForm = forms.create({
  sNumber: forms.fields.string({
    required: true
  }),
})
app.get('/found', function(req, res) {
	profileForm.handle(req,{
		success: function(form){
			//POST hendler
			res.redirect('/bracelet/'+form.data.sNumber);
		},
		error: function(form){
			//error hendler
		},
		empty: function(){
			//GET hendler
			res.render('found', extend({
			    title: 'Find Kid',
			  },{}));
		}
	});
});
//-----------------------------------


app.get('/bracelet/:id', function(req, res) {
	//var id = "https://api.stormpath.com/v1/"+req.params.id
	var id =req.params.id
	console.log(id)
	try{
		client.getDirectory("https://api.stormpath.com/v1/directories/7O0MXcNry77SZuMCDNfBDl", {expand: 'accounts'}, function(err, dir) {
		  	dir.getAccounts({username:id}, function(err, accounts) {
			    accounts.each(function(account, callback) {
				    account.getCustomData(function(err, customData) {
			  			console.log(customData);
			  			res.render('bracelet',{
	  						bardata:customData
	  					})
	  					callback()
					});		
			 	 });
			});
		});}
	catch(e){
		res.render('notfound')
	}
});

app.use('/profile',require('./profile')());

console.log("listening")
app.listen(3000);