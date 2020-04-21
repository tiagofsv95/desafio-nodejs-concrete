import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../../src/app';
import factory from '../../factories';
import truncate from '../../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should be able to register user with telephone', async () => {
    const user = await factory.attrs('UserTelephone');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with invalid input', async () => {
    const user = await factory.attrs('InvalidUser');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      senha: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password);

    expect(compareHash).toBe(true);
  });

  it('should be able recive a token after sign in', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        senha: user.senha,
      });

    expect(response.body).toHaveProperty('token');
  });

  it('should not be able sign in with missing input', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        invalidInput: 'teste',
      });

    expect(response.status).toBe(400);
  });

  it('should not be able sign in with invalid email', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/signin')
      .send(user);

    expect(response.status).toBe(401);
  });

  it('should not be able sign in with invalid password', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        senha: 'teste',
      });

    expect(response.status).toBe(401);
  });

  it('should not be able access without authorization', async () => {
    const user = await factory.attrs('User');

    const { id } = await request(app)
      .post('/users')
      .send(user);

    await request(app)
      .post('/signin')
      .send({
        email: user.email,
        senha: user.senha,
      });

    const response = await request(app).get(`/users/${id}`);

    expect(response.status).toBe(401);
  });

  it('should be able access with a valid authorization token', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const tokenResponse = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        senha: user.senha,
      });

    const { id, token } = tokenResponse.body;

    const response = await request(app)
      .get(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should not be able access with a invalid authorization token', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const tokenResponse = await request(app)
      .post('/signin')
      .send({
        email: user.email,
        senha: user.senha,
      });

    const { id } = tokenResponse.body;

    const response = await request(app)
      .get(`/users/${id}`)
      .set('Authorization', `Bearer INVALIDTOKEN`);

    expect(response.status).toBe(401);
  });
});
