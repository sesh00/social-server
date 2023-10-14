const express = require('express');
const router = express.Router();

module.exports = (friendsList) => {
    router.get('/view', (req, res) => {
        res.render('friends', { friends: friendsList.friends });
    });

    return router;
};