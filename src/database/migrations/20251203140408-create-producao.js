'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Producao', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      cooperadoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cooperados', // Nome da tabela de usuários no banco (confira se é 'Cooperados' ou 'cooperados')
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Ex: LEITE, SOJA, MILHO"
      },
      quantidade: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      data_entrega: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      status_qualidade: {
        type: Sequelize.STRING, // Ex: 'Tipo A', 'Padrão Exportação'
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Producao');
  }
};