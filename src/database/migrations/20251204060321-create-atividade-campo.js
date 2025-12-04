'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AtividadesCampo', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      cooperadoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'cooperados', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tipo: {
        type: Sequelize.STRING, // 'PLANTIO', 'COLHEITA', 'PULVERIZACAO'
        allowNull: false
      },
      data_atividade: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      foto_evidencia: { // Caminho da foto
        type: Sequelize.STRING,
        allowNull: true
      },
      talhao: { // Identificação da área da fazenda
        type: Sequelize.STRING
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AtividadesCampo');
  }
};
