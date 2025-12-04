import { Model, DataTypes } from 'sequelize';

class AtividadeCampo extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      cooperadoId: {
        type: DataTypes.UUID,
        field: 'cooperadoId',
        references: { model: 'Cooperados', key: 'id' }
      },
      tipo: DataTypes.STRING,
      data_atividade: DataTypes.DATEONLY,
      descricao: DataTypes.TEXT,
      foto_evidencia: DataTypes.STRING,
      talhao: DataTypes.STRING
    }, {
      sequelize,
      tableName: 'AtividadesCampo'
    });
  }
}
export default AtividadeCampo;