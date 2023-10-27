const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;

const usersData = require('./src/data/users.json');
const friendsData = require('./src/data/friends.json');
const newsData = require('./src/data/news.json');

const usersRouter = require('./src/routes/users');
const friendsRouter = require('./src/routes/friends');
const newsRouter = require('./src/routes/news');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

app.use('/styles', express.static(path.join(__dirname, 'dist/styles')));

app.use('/js',express.static(path.join(__dirname, 'src/js')));

app.use('/users', usersRouter(usersData, friendsData, newsData));
app.use('/friends', friendsRouter(friendsData));
app.use('/news', newsRouter(newsData));

app.get('*', (req, res) => {
    // res.sendFile(path.join(__dirname, './src/server/views/index.html'));
    res.render('static/index');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
