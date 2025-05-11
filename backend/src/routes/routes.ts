import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { Topic } from '../model/Topic';
import { Comment } from '../model/Comment';
import { UsersLikesComment } from '../model/UsersLikesComment';
import { UsersLikesTopic } from '../model/UsersLikesTopic';

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        res.write('The server is available at the moment.');
        res.status(200).end(`Wow it's working`);
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: Express.User) => {
            if (error) {
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            console.log('Successful login.');
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', async (req: Request, res: Response ) => {
        const { email, name, address, nickname, password, isAdmin } = req.body;
        const user = new User({email: email, name: name, address: address, nickname: nickname, password: password, isAdmin: isAdmin});
        const isExists = await User.findOne( {email: email} );
        if (isExists) {
            console.log('This email is already taken.');
            res.status(500).send('This email is already taken.');
        } else {
            user.save().then(data => {
                console.log('Successfully registration.');
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error');
                }
                console.log('Successfully logged out.');
                res.status(200).send('Successfully log out.');
            });
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.delete('/delete_user/:userId', async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.status(200).send('User successfully deleted.')
        } else {
            res.status(404).send('User not found.');
        }
    });

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    router.get('/isAdmin', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                res.status(200).send(true);
            } else {
                res.status(500).send(false);
            }
        } else {
            res.status(500).send(false);
        }
    });

    router.get('/currentUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(req.user);
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/topic/:topicId', async (req: Request, res: Response) => {
        const { topicId } = req.params;
        try {
            const topic = await Topic.findById(topicId);
            if (topic) {
                console.log('Specific topic found.');
                res.status(200).send(topic);
            } else {
                res.status(404).send('Topic not found.');
            }
        } catch (error) {
            res.status(500).send('Internal server error.');
        }
    });

    router.get('/all_topics', async (req: Request, res: Response) => {
        const topics = await Topic.find();
        if (topics) {
            console.log('All the Topics successfully retrieved.');
            res.status(200).send(topics);
        } else {
            res.status(404).send('No topics found.');
        }
    });

    router.get('/my_topics', async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const topics = await Topic.find({ author: req.user.email });
            if (topics) {
                console.log('My Topics successfully retrieved.');
                res.status(200).send(topics);
            } else {
                res.status(404).send('You have not written any topics yet.');
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/new_topic', (req: Request, res: Response) => {
        const { title } = req.body;

        if (req.isAuthenticated()) {
            const timestamp = new Date();

            const topic = new Topic({author: req.user.email, title: title, timestamp: timestamp});

            topic.save().then(data => {
                console.log('Topic successfully created.');
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.delete('/delete_topic/:topicId', async (req: Request, res: Response) => {
        const topicId = req.params.topicId;
        const deletedTopic = await Topic.findByIdAndDelete(topicId);
        if (deletedTopic) {
            res.status(200).send('Topic successfully deleted.')
        } else {
            res.status(404).send('Topic not found.');
        }
    });

    router.put('/edit_topic/:topicId', async (req: Request, res: Response) => {
        const { topicId } = req.params;
        const { title } = req.body;
        if (req.isAuthenticated()) {
            const topic = await Topic.findById(topicId);
            if (topic) {
                const updatedTopic = await Topic.findOneAndUpdate(
                    { _id: topicId },
                    { $set: { 'title': title } },
                    { new: true }
                );
                res.status(200).send('Topic successfully edited.');
            } else {
                res.status(404).send('Topic not found.');
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.put('/like_topic/:topicId', async (req: Request, res: Response) => {
        const { topicId } = req.params;

        if (req.isAuthenticated()) {
            const username = new UsersLikesTopic({ username: req.user.email });
            const topic = await Topic.findById(topicId);
            if (topic) {
                if (topic.usersLikesTopic.includes(username)) {
                    res.status(400).send('User already liked this topic.');
                } else {
                    topic.usersLikesTopic.push(username);
                    await topic.save();
                    res.status(200).send(topic);
                }
            } else {
                res.status(404).send('Topic not found.');
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.put('/dislike_topic/:topicId', async (req: Request, res: Response) => {
        const { topicId } = req.params;

        if (req.isAuthenticated()) {
            const username = new UsersLikesTopic({ username: req.user.email });
            const topic = await Topic.findById(topicId);
            if (topic) {
                const index = topic.usersLikesTopic.findIndex(user => user.username === username.username);
                if (index !== -1) {
                    topic.usersLikesTopic.splice(index, 1);
                    await topic.save();
                    res.status(200).send(topic);
                } else {
                    res.status(400).send('User has not liked this topic.');
                }
            } else {
                res.status(404).send('Topic not found.');
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/my_comments', async (req: Request, res: Response) => {
        const { author } = req.body;

        const topics = await Topic.find();
        if (topics) {
            const userTopics = topics.map(topic => {
                const userComments = topic.comments.filter(comment => comment.author === author);
                if (userComments.length > 0) {
                    return { ...topic.toObject(), comments: userComments };
                } else {
                    return null;
                }
            }).filter(topic => topic !== null);

            res.status(200).send(userTopics);
        } else {
            res.status(404).send('No comments found.');
        }
    });

    router.post('/new_comment/:topicId', async (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const topicId = req.params.topicId;
            const { comment } = req.body;
            const newComment = new Comment({ author: req.user.email, comment: comment, timestamp: new Date() });

            const topic = await Topic.findById(topicId)
            if (!topic) {
                res.status(404).send('Topic not found');
            } else {
                topic.comments.push(newComment);
                topic.save();
                console.log('Comment successfully created.');
                res.status(200).send(newComment);
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.delete('/delete_comment/:topicId/:commentId', async (req: Request, res: Response) => {
        const { topicId, commentId } = req.params;

        const topic = await Topic.findById(topicId);
        if (topic) {
            const updatedTopic = await Topic.findByIdAndUpdate(
                topicId,
                { $pull: { comments: { _id: commentId } } },
                { new: true }
            );
            res.status(200).send('Comment successfully deleted.');
        } else {
            res.status(404).send('Comment not found.');
        }

    });

    router.put('/edit_comment/:topicId/:commentId', async (req: Request, res: Response) => {
        const { topicId, commentId } = req.params;
        const { comment } = req.body;

        const topic = await Topic.findById(topicId);
        if (topic) {
            const updatedTopic = await Topic.findOneAndUpdate(
                { _id: topicId, 'comments._id': commentId },
                { $set: { 'comments.$.comment': comment } },
                { new: true }
            );
            res.status(200).send('Comment successfully edited.');
        } else {
            res.status(404).send('Topic or Comment not found.');
        }
    });

    router.put('/like_comment/:topicId/:commentId', async (req: Request, res: Response) => {
        const { topicId, commentId } = req.params;
        if (req.isAuthenticated()) {
            const topic = await Topic.findById(topicId);
            if (topic) {
                const userWhoLiked = new UsersLikesComment({ username: req.user.email });
                const updatedTopic = await Topic.findOneAndUpdate(
                    { _id: topicId, 'comments._id': commentId },
                    { $push: { 'comments.$[comment].usersLikesComment': userWhoLiked } },
                    {
                        new: true,
                        arrayFilters: [{ 'comment._id': commentId, 'comment.usersLikesComment.username': { $nin: [req.user.email] } }]
                    }
                );
                if (updatedTopic) {
                    console.log('Comment successfully liked.');
                    res.status(200).send(updatedTopic);
                } else {
                    res.status(200).send(topic);
                }
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.put('/dislike_comment/:topicId/:commentId', async (req: Request, res: Response) => {
        const { topicId, commentId } = req.params;
        if (req.isAuthenticated()) {
            const topic = await Topic.findById(topicId);
            if (topic) {
                const updatedTopic = await Topic.findOneAndUpdate(
                    { _id: topicId, 'comments._id': commentId, 'comments.usersLikesComment.username': req.user.email },
                    { $pull: { 'comments.$[comment].usersLikesComment': { username: req.user.email } } },
                    {
                        new: true,
                        arrayFilters: [{ 'comment._id': commentId }]
                    }
                );
                if (updatedTopic) {
                    console.log('Comment successfully disliked.');
                    res.status(200).send(updatedTopic);
                } else {
                    res.status(200).send(topic);
                }
            }
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    return router;
}