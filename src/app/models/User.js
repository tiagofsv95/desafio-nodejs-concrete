import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { uuid } from 'uuidv4';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        senha: Sequelize.VIRTUAL,
        password: Sequelize.STRING,
        telefones: Sequelize.STRING,
        token: Sequelize.STRING,
        last_login: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      user.id = await uuid();

      if (user.senha) {
        user.password = await bcrypt.hash(user.senha, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

export default User;
