const express = require('express');
const router = express.Router();

module.exports = (usersData, friendsData, newsData) => {
    const getFriendsByUserId = (userId) => {
        return friendsData.friends
            .filter(friendship => friendship.userId === userId)
            .map(friendship => {
                const friend = usersData.users.find(user => user.id === friendship.friendId);
                return { id: friend.id, name: friend.name };
            });
    };

    const getNewsByFriendsIds = (friendIds) => {
        return newsData.news.filter(newsItem => friendIds.includes(newsItem.userId));
    };

    router.get('/view', (req, res) => {
        res.render('users', { users: usersData.users });
    });

    router.get('/:id', (req, res) => {
        const userId = parseInt(req.params.id);
        const user = usersData.users.find(user => user.id === userId);
        if (user) {
            const userFriends = getFriendsByUserId(userId);
            const userNews = getNewsByFriendsIds(userFriends.map(friend => friend.id));

            // Ассоциируем имена друзей с их новостями
            const friendsWithNews = userFriends.map(friend => {
                const news = userNews.filter(newsItem => newsItem.userId === friend.id);
                return { ...friend, news };
            });

            res.render('user', { user, users: usersData.users, friends: friendsWithNews });
        } else {
            res.status(404).send('User not found');
        }
    });

    return router;
};
