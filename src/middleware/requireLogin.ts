import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const { JWT_SECRET } = require('../keys');

const User = mongoose.model('User');

module.exports = (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ error: 'Você precisa estar logado' });
  }

  const token = authorization.replace('Bearer ', '');

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return response.status(401).json({ error: 'Você precisa estar logado' });
    }

    const { _id } = payload;

    User.findById(_id).then(userData => {
      request.user = userData;
      next();
    });
  });
};
