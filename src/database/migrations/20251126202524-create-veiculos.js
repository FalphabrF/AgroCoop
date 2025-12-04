'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('veiculos', {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },

      modelo: {
        type: Sequelize.STRING,
        allowNull: false
      },

      placa: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      marca: {
        type: Sequelize.STRING,
        allowNull: false
      },

      ano: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      localizacao: {
        type: Sequelize.STRING,
        allowNull: false
      },

      valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      quilometragem: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      opcionais: {
        type: Sequelize.STRING,
        allowNull: true
      },

      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      telefone: {
        type: Sequelize.STRING,
        allowNull: false
      },

      fotos: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }

    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('veiculos');
  }
};
