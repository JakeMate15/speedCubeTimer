const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

const loginRoutes = require('./routes/login');
const timerRoutes = require('./routes/timer');
const estRoutes = require('./routes/est');

const app = express();
app.set('port', 5000);

app.use(express.static(__dirname + '/css'));
app.use(express.static('src'));


app.set('views', __dirname + '/views');
app.engine('.hbs', engine({ 
    extname: '.hbs' 
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'timer'
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.listen(app.get('port'), () => {
    console.log('Puerto:', app.get('port'));
});


app.use('/', loginRoutes);
app.use('/', timerRoutes);
app.use('/', estRoutes);

app.get('/', (req, res) => {
    if(req.session.loggedin == true){
        //res.render('home', req.session);
        res.redirect('/timer', req.session);
    }
    else{
        res.redirect('/login');
    }
});