const express = require('express');
const router = express.Router();
const fs = require('fs');

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

    router.post('/:id', (req, res) => {
        const userId = parseInt(req.params.id);
        const userIndex = usersData.users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            // Обновляем данные пользователя
            usersData.users[userIndex] = { ...usersData.users[userIndex], ...req.body };

            fs.writeFile('src/data/users.json', JSON.stringify(usersData, null, 2), (err) => {
                if (err) {
                    console.error('Ошибка при записи в users.json', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.status(200).send('User data updated successfully.');
                }
            });
        } else {
            res.status(404).send('User not found');
        }
    });


    return router;
};
