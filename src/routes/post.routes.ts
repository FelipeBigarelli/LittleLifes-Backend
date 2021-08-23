import express from 'express';
import mongoose from 'mongoose';

const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

const Post = mongoose.model('Post');

router.get('/allpost', (request, response) => {
  Post.find()
    .populate('postedBy', '_id name')
    .then(posts => {
      return response.json({ posts });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/createpost', requireLogin, (request, response) => {
  const { title, body, photo } = request.body;
  console.log(title, body, photo);

  if (!title || !body || !photo) {
    return response.status(422).json({ error: 'Preencha todos os campos' });
  }

  request.user.password = undefined;

  const post = new Post({
    title,
    body,
    photo,
    postedBy: request.user,
  });

  console.log({ post });

  post
    .save()
    .then(result => {
      response.json({ post: result });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/mypost', requireLogin, (request, response) => {
  Post.find({ postedBy: request.user._id })
    .populate('PostedBy', '_id name')
    .then(myPost => {
      return response.json({ myPost });
    })
    .catch(err => {
      console.log(err);
    });
});

export default router;
