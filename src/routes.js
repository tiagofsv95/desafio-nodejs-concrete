import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SignInController from './app/controllers/SignInController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/signin', SignInController.store);

routes.use(authMiddleware);

routes.get('/users/:id', UserController.index);

export default routes;
