const express = require('express');
const router = express.Router();

module.exports = (newsData) => {
    router.get('/view', (req, res) => {
        res.render('news', { news: newsData.news });
    });

    return router;
};