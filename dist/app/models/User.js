"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);
var _uuidv4 = require('uuidv4');

class User extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: _sequelize2.default.UUID,
          primaryKey: true,
        },
        name: _sequelize2.default.STRING,
        email: _sequelize2.default.STRING,
        senha: _sequelize2.default.VIRTUAL,
        password: _sequelize2.default.STRING,
        telefones: _sequelize2.default.STRING,
        token: _sequelize2.default.STRING,
        last_login: _sequelize2.default.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      user.id = await _uuidv4.uuid.call(void 0, );

      if (user.senha) {
        user.password = await _bcryptjs2.default.hash(user.senha, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return _bcryptjs2.default.compare(password, this.password);
  }
}

exports. default = User;
