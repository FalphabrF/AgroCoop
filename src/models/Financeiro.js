import { Model, DataTypes } from 'sequelize';

class Financeiro extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      // [FIX] Declaração explícita para evitar que o Sequelize busque 'cooperado_id'
      cooperadoId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'cooperadoId', // <--- ISSO CONSERTA O ERRO
        references: {
          model: 'cooperados',
          key: 'id'
        }
      },
      tipo: {
        type: DataTypes.ENUM('CREDITO', 'DEBITO'),
        allowNull: false
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      data_movimento: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      tableName: 'Financeiros'
    });
  }
}

export default Financeiro;