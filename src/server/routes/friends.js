const express = require('express');
const router = express.Router();

module.exports = (friendsData) => {
    router.get('/view', (req, res) => {
        res.render('friends', { friends: friendsData.friends });
    });

    return router;
};
