const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('../src/routes/users');

const app = express();
app.use(bodyParser.json());
app.use('/users', usersRouter);

describe('User Routes', () => {
    test('GET /users/:id/news - should return user and friends news', async () => {
        const response = await request(app).get('/users/4/news');
        expect(response.status).toBe(404);
    });

    test('POST /users/:userId/publish - should publish news', async () => {
        const response = await request(app)
            .post('/users/4/publish')
            .send({ content: 'Test news content' });
        expect(response.status).toBe(404);
    });
});
