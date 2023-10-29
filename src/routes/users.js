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

    router.get('/all', (req, res) => {
        res.json(usersData.users);
    });

    router.get('/:id/details', (req, res) => {
        const userId = parseInt(req.params.id);
        const user = usersData.users.find(user => user.id === userId);
        if (user) {
            const userFriends = getFriendsByUserId(userId);
            const userNews = getNewsByFriendsIds(userFriends.map(friend => friend.id));

            const friendsWithNews = userFriends.map(friend => {
                const news = userNews.filter(newsItem => newsItem.userId === friend.id);
                return { ...friend, news };
            });

            res.json({ user, friends: friendsWithNews });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });

    router.get('/:id', (req, res) => {
        const userId = parseInt(req.params.id);
        const user = usersData.users.find(user => user.id === userId);
        if (user) {
            const userFriends = getFriendsByUserId(userId);
            const userNews = getNewsByFriendsIds(userFriends.map(friend => friend.id));

            const friendsWithNews = userFriends.map(friend => {
                const news = userNews.filter(newsItem => newsItem.userId === friend.id);
                return { ...friend, news };
            });

            res.render('user', { user, users: usersData.users, friends: friendsWithNews });
        } else {
            res.status(404).send('User not found');
        }
    });

    // router.post('/register', ...)
    router.post('/register', (req, res) => {
        const { name, info, birthdate, email, password } = req.body;

        const existingUser = usersData.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const newUser = {
            id: usersData.users.length + 1,
            name: name,
            info: info,
            birthdate: birthdate,
            email: email,
            photo: 'https://w.forfun.com/fetch/17/17d767857f1841474ccace158115b032.jpeg?w=2200',
            role: 'user',
            status: 'active',
            password: password,
        };

        usersData.users.push(newUser);

        fs.writeFile('src/data/users.json', JSON.stringify(usersData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to users.json', err);
                res.status(500).send('Internal Server Error');
            } else {
                // Возвращаем userId в ответе
                res.status(200).json({ success: true, message: 'User registered successfully', userId: newUser.id });
            }
        });
    });

// router.post('/login', ...)
    router.post('/login', (req, res) => {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);
        const user = usersData.users.find(user => user.email === email && user.password === password);
        if (user) {
            // Возвращаем userId в ответе
            res.status(200).json({ success: true, message: 'Вход выполнен успешно', userId: user.id });
        } else {
            res.status(401).json({ error: 'Неправильный email или пароль' });
        }
    });


    router.post('/:id', (req, res) => {
        const userId = parseInt(req.params.id);
        const userIndex = usersData.users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
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
