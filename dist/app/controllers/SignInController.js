"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class SignInController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        mensagem:
          'Falha na validação dos campos. Verifique os dados e tente novamente',
      });
    }

    const { email } = req.body;
    const password = req.body.senha;

    const user = await _User2.default.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    const { id, name, last_login, created_at, updated_at } = user;

    const token = _jsonwebtoken2.default.sign({ id }, _auth2.default.secret, {
      expiresIn: _auth2.default.expiresIn,
    });

    user.token = token;
    user.last_login = new Date();

    await user.save();

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

exports. default = new SignInController();
