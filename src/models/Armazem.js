import { Model, DataTypes } from 'sequelize';

class Armazem extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nome: DataTypes.STRING,
      localizacao: DataTypes.STRING,
      capacidade_hora: DataTypes.INTEGER
    }, {
      sequelize,
      tableName: 'Armazens'
    });
  }
}
export default Armazem;