var express = require('express');
var jsonParser = require('body-parser').json();
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.listen(3000, () => console.log('Server started'))
app.get('/', (req, res) => res.render('index'));
