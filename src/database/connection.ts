import mongoose from 'mongoose';

import '../models/User';
import '../models/Post';

const { MONGOURI } = require('../keys');

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

try {
  mongoose.connection.on('connected', () => {
    console.log('Connected to mongo');
  });
} catch (err) {
  mongoose.connection.on('error', error => {
    console.log('Connection error', error);
  });
}
