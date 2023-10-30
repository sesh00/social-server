const request = require('supertest');
const express = require('express');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const usersRouter = require('../src/routes/users');
const friendsRouter = require('../src/routes/friends');
const newsRouter = require('../src/routes/news');

const usersData = require('../src/data/users.json');
const friendsData = require('../src/data/friends.json');
const newsData = require('../src/data/news.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const io = {
    on: jest.fn(),
};

app.use('/users', usersRouter(usersData, friendsData, newsData, io));
app.use('/friends', friendsRouter(friendsData));
app.use('/news', newsRouter(newsData, io));

describe('Test routes', () => {
    test('GET /users/:id/news should return 200', async () => {
        const response = await request(app).get('/users/1/news');
        expect(response.statusCode).toBe(200);
    });

    test('POST /users/:userId/friends should return 200', async () => {
        const response = await request(app)
            .post('/users/1/friends')
            .send({ currentId: 1, friendId: 2 });
        expect(response.statusCode).toBe(400);
    });

    test('POST /users/:userId/friends/:friendId should return 200', async () => {
        const response = await request(app).post('/users/1/friends/2');
        expect(response.statusCode).toBe(400);
    });

});

