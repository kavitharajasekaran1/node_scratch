const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const morgan = require('morgan')
dotenv.config({path:'./config/config.env'});
const connectDB = require('./config/db.js');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session')
connectDB();
const app = express();

require('./config/passport')(passport)

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}
app.use(express.static(path.join(__dirname,'public')))

app.engine('.hbs', exphbs({defaultLayout : 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }))
app.use(passport.initialize());
app.use(passport.session())

app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server is running on ${process.env.NODE_ENV} mode on port ${PORT}`));