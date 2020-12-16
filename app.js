const c = require('./config');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const bets = require('./data/bets');
const path = require('path');
const session = require('express-session');
const configRoutes = require('./routes');
const users = require('./data/users');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(
  session({
    name: 'AuthCookie',
    secret: "jerry",
    saveUninitialized: true,
    resave: false}));

app.get('/favicon.ico', (req, res) => {
  res.status(404).send();
});

app.get('/', (req, res) => {
  console.log("login.js / GET routes finds AuthCookie " + req.session.AuthCookie);
  if (!req.session.AuthCookie) {
    res.render('login', {cssOverrides: "login.css"});
    return;
  }
  console.log("req.session.user is " + JSON.stringify(req.session.user));
  const user = req.session.user;
  if (user)
    if (user.balance) {
      res.redirect('bet');
    }
    else
      res.redirect('fund');
  else {
    console.error("login.js finds no user but active session");
    res.status(401).send("No user but active session error");
  }
});

app.post('/', async (req, res) => {
  console.log("app.post to /");
  try {
    const {username, pwd} = req.body;
    const user = await users.getUserByName(username);
    if (user && await users.verifyPassword(user, pwd)) {
      console.log("req.sessionID is " + req.sessionID);
      req.session.AuthCookie = req.sessionID;
      req.session.user = user;
      console.log('user is ' + JSON.stringify(user));
      res.redirect(user.balance >= c.appConfig.minBet ? '/bet' : '/fund');
    }
    else {
      displayMessage = "login"
      loginMessage = "Username/Password not correct"
      res.staus(401).render("login", {displayMessage, loginMessage});
    }
  }
  catch (e) {
    res.status(401).render('login', {error: true});
    console.log(e.message);
  }
});

configRoutes(app);

// ----------------------------------------------------------------------------
// Define an error handler and install it.
// ----------------------------------------------------------------------------

async function error(err, req, res, next) {
  console.log(err);
  console.log(err.stack);
  res.redirect('/');
  //res.status(500).send("Internal Server Error");
}
app.get(error);
 
async function main() {
  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
    console.log('Current lines available on http://localhost:3000/api/lines/nfl');
  });
  //bets.startResolveProcessor(); do it manually for now
}

main().then().catch(console.log);