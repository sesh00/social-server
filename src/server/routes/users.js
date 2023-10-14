const express = require('express');
const router = express.Router();

module.exports = (usersData) => {
    router.get('/view', (req, res) => {
        res.render('users', { users: usersData.users });
    });

    return router;
};
