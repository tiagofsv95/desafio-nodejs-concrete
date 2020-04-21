import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';

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

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ mensagem: 'E-mail já existente' });
    }

    const { telefones } = req.body;

    req.body.telefones = telefones.map(
      telefone => telefone.ddd + telefone.numero
    );

    const user = await User.create(req.body);

    const { id, name, email } = user;

    user.token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
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

    const user = await User.findOne({
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

export default new UserController();
