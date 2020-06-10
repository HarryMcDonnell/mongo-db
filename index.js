const express = require ('express'); //npm i express-handlebars
const hbs = require ('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser'); //npm i body-parser
const mongoose = require('mongoose');

const User = require('./models/userModel');

const app = express();

mongoose.connect('mongodb+srv://new-user1:Password123@cluster0-7zva7.azure.mongodb.net/users?retryWrites=true&w=majority', { //changed url to own mongo db 
    useNewUrlParser: true, useUnifiedTopology: true
});

app.use(express.static(path.join(__dirname, 'public')));
//ignore data types and make everything a string
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine('.hbs', hbs({
    defaultLayout: 'layout',
    extname: 'hbs'
}));
app.set('view engine', '.hbs');

app.get('/', async (req, res) => { // localhost:3000/ home page
    res.render('signup');
});

app.post('/signup', async(req, res) => {
    /*
        get user info from form 
        make sure data exists

        if no data create new user

        if data exists already rerender with err 
    */
	if (!req.body.userName || !req.body.email || !req.body.password) {
		res.render('signup', {err: "Please provide all credentials"});
		return;
	}
	const user = new User({
		userName: req.body.userName,
		email: req.body.email,
		password: req.body.password
	});
	let isDuplicate = false;
	await user.save().catch((reason) => {
		res.render('signup', {err: "A user with this user name or password already exists"});
		isDuplicate = true;
		return;
	});
	if (isDuplicate) {
		return
	}
	res.redirect(`/profile/?userName=${req.body.userName}`);
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async(req, res) => {
    /*
        get username and password from the form 
        check they exist

        search DB for the username 
        with results from DB, check passwords match 

        if match go to profile

        else go back to login page with err
    */
    if (!req.body.userName || !req.body.password) {
        res.render('login', {err: "Please provide all credentials"});
        return;
    }
    let logInDeets = {
       userName: req.body.userName,
       password: req.body.password
    }
    let checkDeets = await User.findOne({ userName: logInDeets.userName });
    if (checkDeets == null) {
        res.render('login', {err: "User not found"});
        return;
    }
    else if ((logInDeets.userName == checkDeets.userName && logInDeets.password == checkDeets.password)) {
        res.redirect(`/profile/?userName=${logInDeets.userName}`);
    }
    else {
        res.render('login', {err: "Username or Password incorrect"});
    }
    console.log(logInDeets.userName);
    console.log(logInDeets.password);
    console.log(checkDeets);
});

app.get('/profile', async(req, res) => {
    let user = await User.findOne({userName: req.query.userName});
        if (user == null) {
            res.render('profile', {err: "that user doesn't exist"});
            return;
        }
    res.render('profile', {user: user.toObject()});
})
app.listen(3000,() => { // localhost:3000 but can be any port between 3000-8000 i think
    console.log("listening on port 3000"); 
})