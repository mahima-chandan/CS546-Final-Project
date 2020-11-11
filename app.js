const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const configRoutes = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

configRoutes(app);
 
async function main() {
  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });
}

main().then(x => console.log(x)).catch(x => console.log(x));