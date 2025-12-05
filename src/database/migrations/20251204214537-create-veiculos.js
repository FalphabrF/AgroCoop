'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('veiculos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      // [FIX] A Chave Estrangeira que faltava
      cooperadoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cooperados',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      modelo: { type: Sequelize.STRING, allowNull: false },
      placa: { type: Sequelize.STRING, allowNull: false },
      marca: { type: Sequelize.STRING, allowNull: false },
      ano: { type: Sequelize.INTEGER, allowNull: false },
      localizacao: { type: Sequelize.STRING, allowNull: false },
      valor: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      quilometragem: { type: Sequelize.INTEGER, allowNull: false },
      opcionais: { type: Sequelize.STRING },
      descricao: { type: Sequelize.TEXT },
      telefone: { type: Sequelize.STRING },
      foto_principal: { type: Sequelize.STRING }, // Salva o nome do arquivo da 1ª foto
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('veiculos');
  }
};