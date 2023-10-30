const express = require('express');
const http = require('http');

const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require("@sentry/profiling-node");

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

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




Sentry.init({
    dsn: 'https://db447807caf709537f921eebd40f9253@o4506138265911296.ingest.sentry.io/4506138270302208',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});



app.use('/styles', express.static(path.join(__dirname, 'dist/styles')));
app.use('/js', express.static(path.join(__dirname, 'src/js')));

app.use('/users', usersRouter(usersData, friendsData, newsData, io)); // передаем объект io в usersRouter
app.use('/friends', friendsRouter(friendsData));
app.use('/news', newsRouter(newsData, io)); // передаем объект io в newsRouter

app.get('*', (req, res) => {
    res.render('static/index');
});

io.on('connection', (socket) => {
    console.log('User connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


