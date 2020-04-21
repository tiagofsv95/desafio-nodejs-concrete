import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';

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

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    const { id, name, last_login, created_at, updated_at } = user;

    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
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

export default new SignInController();
