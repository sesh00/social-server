const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const usersData = require('./src/server/data/users.json');
const friendsData = require('./src/server/data/friends.json');
const newsData = require('./src/server/data/news.json');

const usersRouter = require('./src/server/routes/users');
const friendsRouter = require('./src/server/routes/friends');
const newsRouter = require('./src/server/routes/news');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/server/views'));
app.use('/styles', express.static(path.join(__dirname, 'src/server/styles')));

app.use(express.static(path.join(__dirname, './dist/client')));

app.use('/users', usersRouter(usersData));
app.use('/friends', friendsRouter(friendsData));
app.use('/news', newsRouter(newsData));

app.get('*', (req, res) => {
   // res.sendFile(path.join(__dirname, './src/server/views/index.html'));
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
