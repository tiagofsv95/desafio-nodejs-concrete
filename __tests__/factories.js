import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  senha: faker.internet.password(),
});

factory.define('UserTelephone', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  senha: faker.internet.password(),
  telefones: [
    {
      numero: '123456789',
      ddd: '11',
    },
    {
      numero: '987654321',
      ddd: '31',
    },
  ],
});

factory.define('InvalidUser', User, {
  email: faker.internet.email(),
  senha: faker.internet.password(),
});

export default factory;
