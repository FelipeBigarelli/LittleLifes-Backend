import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const requireLogin = require('../middleware/requireLogin');

const { JWT_SECRET } = require('../keys');

const router = express.Router();

const User = mongoose.model('User');

router.get('/protected', requireLogin, (request, response) => {
  return response.send('Aoba');
});

router.post('/signup', (request, response) => {
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    return response.json({ err: 'Complete os campos em branco' });
  }

  User.findOne({ email })
    .then(findUser => {
      if (findUser) {
        return response.json({ error: 'Email já cadastrado' });
      }

      bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });

        user
          .save()
          .then(() => {
            return response.json({ message: 'Usuário criado com sucesso' });
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/signin', (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(422).json({ err: 'Complete os campos em branco' });
  }

  User.findOne({ email }).then(savedUser => {
    if (!savedUser) {
      return response.status(422).json({ err: 'E-mail e/ou senha inválidos' });
    }

    bcrypt
      .compare(password, savedUser.password)
      .then(doMatch => {
        if (doMatch) {
          // return response.json({ message: 'Logado com sucesso' });

          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email } = savedUser;

          console.log(token);

          return response.json({ token, user: { _id, name, email } });
        }
        return response.json({ err: 'E-mail e/ou senha inválidos' });
      })
      .catch(err => {
        console.log(err);
      });
  });
});

export default router;
