import { Model, DataTypes } from 'sequelize'

export default class Veiculo extends Model {
  static init(sequelize) {
    super.init({

      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },

      modelo: {
        type: DataTypes.STRING,
        allowNull: false
      },

      placa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      marca: {
        type: DataTypes.STRING,
        allowNull: false
      },

      ano: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      localizacao: {
        type: DataTypes.STRING,
        allowNull: false
      },

      valor: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      },

      quilometragem: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      opcionais: {
        type: DataTypes.STRING,
        allowNull: true
      },

      descricao: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      telefone: {
        type: DataTypes.STRING,
        allowNull: false
      },

      fotos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      }

    }, {
      sequelize,
      tableName: 'veiculos'
    })
  }
}
