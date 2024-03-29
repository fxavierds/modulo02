const bcrypt = require('bcryptjs');

module.exports = {
  up: (QueryInterface) =>
    QueryInterface.bulkInsert(
      'users',
      [
        {
          nome: 'Distribuidora FastFeet',
          email: 'admin@fastfeet.com',
          password_hash: bcrypt.hashSync('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    ),

  down: () => {},
};
