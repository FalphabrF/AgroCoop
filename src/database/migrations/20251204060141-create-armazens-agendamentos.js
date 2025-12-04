'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tabela de Armazéns (Locais de Entrega)
    await queryInterface.createTable('Armazens', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      localizacao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      capacidade_hora: { // Quantos caminhões por hora o armazém suporta
        type: Sequelize.INTEGER,
        defaultValue: 10
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });

    // 2. Tabela de Agendamentos (Slots)
    await queryInterface.createTable('Agendamentos', {
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
      armazemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Armazens', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      data_agendada: {
        type: Sequelize.DATEONLY, // Ex: 2023-12-25
        allowNull: false
      },
      hora_agendada: {
        type: Sequelize.INTEGER, // Ex: 14 (para 14:00)
        allowNull: false
      },
      status: {
        type: Sequelize.STRING, // 'AGENDADO', 'CONCLUIDO', 'CANCELADO'
        defaultValue: 'AGENDADO'
      },
      protocolo: { // O código que gera o QR Code
        type: Sequelize.STRING,
        unique: true
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Agendamentos');
    await queryInterface.dropTable('Armazens');
  }
};