const express = require('express');
const router = express.Router();
const fs = require('fs');

module.exports = (usersData, friendsData, newsData, io) => {
    const getFriendsByUserId = (userId) => {
        return friendsData.friends
            .filter(friendship => friendship.userId === userId)
            .map(friendship => {
                const friend = usersData.users.find(user => user.id === friendship.friendId);
                return {id: friend.id, name: friend.name};
            });
    };

    const getNewsByFriendsIds = (friendIds) => {
        return newsData.news.filter(newsItem => friendIds.includes(newsItem.userId));
    };

    router.get('/:id/news', (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const user = usersData.users.find((user) => user.id === userId);

            if (user) {
                const userFriends = getFriendsByUserId(userId);
                const friendIds = userFriends.map((friend) => friend.id);

                const allFriendIds = [...friendIds, userId];

                const userAndFriendsNews = newsData.news
                    .filter((newsItem) => allFriendIds.includes(newsItem.userId))
                    .map((newsItem) => {
                        const newsUser = usersData.users.find((u) => u.id === newsItem.userId);
                        return {user: newsUser, text: newsItem.text};
                    });

                res.json({news: userAndFriendsNews});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (error) {
            console.error('Error in /:id/news', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.post('/:userId/publish', (req, res) => {
        try {
            const userId = parseInt(req.params.userId);
            const content = req.body.content;

            if (userId !== undefined && content) {
                const newsItem = {
                    id: newsData.news.length + 1,
                    userId: userId,
                    text: content,
                };

                newsData.news.push(newsItem);

                fs.writeFile('src/data/news.json', JSON.stringify(newsData, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to news.json', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.status(200).json({success: true, message: 'News published successfully'});
                        io.emit('news', {user: userId, text: content});
                    }
                });
            } else {
                res.status(400).json({error: 'Invalid user or content'});
            }
        } catch (error) {
            console.error('Error in /:userId/publish', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.post('/:userId/friends', (req, res) => {
        try {
            const currentUserId = parseInt(req.body.currentId);
            const friendId = parseInt(req.body.friendId);

            if (currentUserId && friendId) {
                const existingFriendship = friendsData.friends.find(
                    (friendship) => friendship.userId === currentUserId && friendship.friendId === friendId
                );

                if (existingFriendship) {
                    return res.status(400).json({error: 'User is already your friend'});
                }

                const newFriendship = {
                    id: friendsData.friends.length + 1,
                    userId: currentUserId,
                    friendId: friendId,
                };

                friendsData.friends.push(newFriendship);

                fs.writeFile('src/data/friends.json', JSON.stringify(friendsData, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to friends.json', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.status(200).json({success: true, message: 'Friend added successfully'});
                    }
                });
            } else {
                res.status(400).json({error: 'Invalid user or friend ID'});
            }
        } catch (error) {
            console.error('Error in /:userId/friends', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.post('/:userId/friends/:friendId', (req, res) => {
        try {
            const currentUserId = parseInt(req.body.currentId);
            const friendId = parseInt(req.body.friendId);

            if (currentUserId && friendId) {
                const friendshipIndex = friendsData.friends.findIndex(
                    (friendship) => friendship.userId === currentUserId && friendship.friendId === friendId
                );

                if (friendshipIndex !== -1) {
                    friendsData.friends.splice(friendshipIndex, 1);

                    fs.writeFile('src/data/friends.json', JSON.stringify(friendsData, null, 2), (err) => {
                        if (err) {
                            console.error('Error writing to friends.json', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            res.status(200).json({success: true, message: 'Friend removed successfully'});
                        }
                    });
                } else {
                    res.status(404).json({error: 'Friend not found'});
                }
            } else {
                res.status(400).json({error: 'Invalid user or friend ID'});
            }
        } catch (error) {
            console.error('Error in /:userId/friends/:friendId', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.get('/view', (req, res) => {
        try {
            res.render('users', {users: usersData.users});
        } catch (error) {
            console.error('Error in /view', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.get('/all', (req, res) => {
        try {
            res.json(usersData.users);
        } catch (error) {
            console.error('Error in /all', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.get('/:id/details', (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const user = usersData.users.find(user => user.id === userId);
            if (user) {
                const userFriends = getFriendsByUserId(userId);
                const userNews = getNewsByFriendsIds(userFriends.map(friend => friend.id));

                const friendsWithNews = userFriends.map(friend => {
                    const news = userNews.filter(newsItem => newsItem.userId === friend.id);
                    return {...friend, news};
                });

                const transformedNews = newsData.news
                    .filter(ne => ne.userId === userId)
                    .map(ne => ({user: user, text: ne.text}));

                res.json({user: user, friends: friendsWithNews, news: transformedNews});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        } catch (error) {
            console.error('Error in /:id/details', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.get('/:id', (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const user = usersData.users.find(user => user.id === userId);

            if (user) {
                const userFriends = getFriendsByUserId(userId);
                const userNews = getNewsByFriendsIds(userFriends.map(friend => friend.id));

                const friendsWithNews = userFriends.map(friend => {
                    const news = userNews.filter(newsItem => newsItem.userId === friend.id);
                    return {...friend, news};
                });

                res.render('user', {user, users: usersData.users, friends: friendsWithNews});
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error('Error in /:id', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.post('/register', (req, res) => {
        try {
            const {name, info, birthdate, email, password} = req.body;

            const existingUser = usersData.users.find(user => user.email === email);
            if (existingUser) {
                return res.status(400).json({error: 'User with this email already exists'});
            }

            const newUser = {
                id: usersData.users.length + 1,
                name: name,
                info: info,
                birthdate: birthdate,
                email: email,
                photo: 'https://w.forfun.com/fetch/17/17d767857f1841474ccace158115b032.jpeg',
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
                    res.status(200).json({success: true, message: 'User registered successfully', userId: newUser.id});
                }
            });
        } catch (error) {
            console.error('Error in /register', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.post('/login', (req, res) => {
        try {
            const {email, password} = req.body;

            const user = usersData.users.find(user => user.email === email && user.password === password);
            if (user) {
                res.status(200).json({success: true, message: 'Вход выполнен успешно', userId: user.id});
            } else {
                res.status(401).json({error: 'Неправильный email или пароль'});
            }
        } catch (error) {
            console.error('Error in /login', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    router.post('/:id', (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const userIndex = usersData.users.findIndex(user => user.id === userId);

            if (userIndex !== -1) {
                usersData.users[userIndex] = {...usersData.users[userIndex], ...req.body};

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
        } catch (error) {
            console.error('Error in /:id', error);
            res.status(500).json({error: 'Internal Server Error'});
        }
    });

    return router;
}
