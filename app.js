const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const bets = require('./data/bets');
const path = require('path');
const session = require('express-session');

const configRoutes = require('./routes');

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

configRoutes(app);

// ----------------------------------------------------------------------------
// Define an error handler and install it.
// ----------------------------------------------------------------------------

async function error(err, req, res, next) {
  console.log(err.stack);
  res.status(500).send("Internal Server Error");
}
app.use(error);
 
async function main() {
  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
    console.log('Current lines available on http://localhost:3000/api/lines/nfl');
  });
  bets.startResolveProcessor();
}

main().then().catch(console.log);