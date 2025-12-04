import Sequelize, { Model } from 'sequelize'

class Cooperado extends Model {
    static init(sequelize) {
        super.init(

            {
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
                numero_registro: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true
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

                foto: {
                    type: Sequelize.STRING,
                    allowNull: true
                },

                data_entrada: {
                    type: Sequelize.DATEONLY,
                    defaultValue: Sequelize.NOW
                },

                senha: {
                    type: Sequelize.STRING,
                    allowNull: false
                },

                ativo: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: true
                }

            },

            {
                sequelize,
                tableName: 'cooperados',
                timestamps: true,    // cria created_at e updated_at
                underscored: true    // usa created_at em vez de createdAt
            }
        )
    }
}

export default Cooperado
