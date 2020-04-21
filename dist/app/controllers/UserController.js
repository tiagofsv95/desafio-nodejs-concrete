"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string()
        .required()
        .min(6),
      telefones: Yup.array().of(
        Yup.object().shape({
          numero: Yup.string(),
          ddd: Yup.string(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        mensagem:
          'Falha na validação dos campos. Verifique os dados e tente novamente',
      });
    }

    const userExists = await _User2.default.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ mensagem: 'E-mail já existente' });
    }

    const { telefones } = req.body;
    if (telefones) {
      req.body.telefones = JSON.stringify(
        telefones.map(telefone => telefone.ddd + telefone.numero)
      );
    }

    const user = await _User2.default.create(req.body);

    const { id, name, email } = user;

    user.token = _jsonwebtoken2.default.sign({ id }, _auth2.default.secret, {
      expiresIn: _auth2.default.expiresIn,
    });
    user.last_login = new Date();

    await user.save();

    const { token, last_login, created_at, updated_at } = user;

    return res.json({
      id,
      name,
      email,
      token,
      ultimo_login: last_login,
      data_criacao: created_at,
      data_atualizacao: updated_at,
    });
  }

  async index(req, res) {
    const { id } = req.params;

    const user = await _User2.default.findOne({
      where: { id },
    });

    const { name, email, token, last_login, created_at, updated_at } = user;

    return res.json({
      id,
      name,
      email,
      token,
      ultimo_login: last_login,
      data_criacao: created_at,
      data_atualizacao: updated_at,
    });
  }
}

exports. default = new UserController();
