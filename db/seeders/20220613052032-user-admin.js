const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Role } = require('../../app/models');

module.exports = {
  async up(queryInterface) {
    const password = 'password';
    const encryptedPassword = bcrypt.hashSync(password);
    const timestamp = new Date();

    const role = await Role.findOne({ where: { name: 'ADMIN' } });

    const users = [
      {
        name: 'Admin',
        email: 'admin@binar.co.id',
        encryptedPassword,
        roleId: role.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', { name: { [Op.in]: names } }, {});
  },
};
