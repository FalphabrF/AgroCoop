import { Model, DataTypes } from 'sequelize';

class Agendamento extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      cooperadoId: {
        type: DataTypes.UUID,
        field: 'cooperadoId', // Mapeamento explícito
        references: { model: 'Cooperados', key: 'id' }
      },
      armazemId: {
        type: DataTypes.UUID,
        field: 'armazemId', // Mapeamento explícito
        references: { model: 'Armazens', key: 'id' }
      },
      data_agendada: DataTypes.DATEONLY,
      hora_agendada: DataTypes.INTEGER,
      status: DataTypes.STRING,
      protocolo: DataTypes.STRING
    }, {
      sequelize,
      tableName: 'Agendamentos'
    });
  }
}
export default Agendamento;