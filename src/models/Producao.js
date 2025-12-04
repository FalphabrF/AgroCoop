import { Model, DataTypes } from 'sequelize';

class Producao extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      // [FIX] Declaração explícita da FK
      cooperadoId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'cooperadoId', // <--- Força o mapeamento correto
        references: {
          model: 'cooperados',
          key: 'id'
        }
      },
      tipo: {
        type: DataTypes.STRING, 
        allowNull: false
      },
      quantidade: {
        type: DataTypes.FLOAT, 
        allowNull: false
      },
      data_entrega: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      status_qualidade: {
        type: DataTypes.STRING 
      }
    }, {
      sequelize, 
      tableName: 'Producao'
    });
  }
}

export default Producao;