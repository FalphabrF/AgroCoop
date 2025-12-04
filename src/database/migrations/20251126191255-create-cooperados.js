'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cooperados', {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },

      nome_completo: {
        type: Sequelize.STRING,
        allowNull: false
      },

      cpf: {
        type: Sequelize.STRING(14),
        allowNull: false,
        unique: true
      },

      rg: {
        type: Sequelize.STRING(15),
        allowNull: true
      },

      data_nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      telefone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true
      },

      endereco: {
        type: Sequelize.STRING,
        allowNull: false
      },

      cidade: {
        type: Sequelize.STRING,
        allowNull: false
      },

      estado: {
        type: Sequelize.STRING(2),
        allowNull: false
      },

      cep: {
        type: Sequelize.STRING(9),
        allowNull: true
      },

      tipo_cooperado: {
        type: Sequelize.ENUM('associado', 'vendedor', 'produtor', 'fornecedor'),
        allowNull: false
      },

      numero_registro: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      foto: {
        type: Sequelize.STRING,
        allowNull: true
        // aqui vai o caminho da imagem, ex:
        // /uploads/cooperados/abc123.jpg
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false
      },

      data_entrada: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
      },

      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cooperados');
  }
};

