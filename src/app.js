import './bootstrap';

import express from 'express';
import cors from 'cors';

import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();

    this.server.use(this.errorRoute);
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  errorRoute(req, res, next) {
    return res.status(404).json({ mensagem: 'Rota não existe' });
  }
}

export default new App().server;
