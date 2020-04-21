"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');

var _UserController = require('./app/controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);
var _SignInController = require('./app/controllers/SignInController'); var _SignInController2 = _interopRequireDefault(_SignInController);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);

const routes = new (0, _express.Router)();

routes.post('/users', _UserController2.default.store);
routes.post('/signin', _SignInController2.default.store);

routes.use(_auth2.default);

routes.get('/users/:id', _UserController2.default.index);

exports. default = routes;
