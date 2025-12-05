import { Model, DataTypes } from 'sequelize';

class Veiculo extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      cooperadoId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'cooperadoId', // Mantemos camelCase na coluna ou mudamos para snake_case se preferir
        references: {
          model: 'cooperados', // [ATENÇÃO] Se mudou veiculos, provavelmente cooperados também é minúsculo?
          key: 'id'
        }
      },
      modelo: DataTypes.STRING,
      placa: DataTypes.STRING,
      marca: DataTypes.STRING,
      ano: DataTypes.INTEGER,
      localizacao: DataTypes.STRING,
      valor: DataTypes.DECIMAL(10, 2),
      quilometragem: DataTypes.INTEGER,
      opcionais: DataTypes.STRING,
      descricao: DataTypes.TEXT,
      telefone: DataTypes.STRING,
      foto_principal: {
        type: DataTypes.STRING,
        field: 'foto_principal'
      }
    }, {
      sequelize,
      // [FIX] Respeitando sua decisão: Tabela em minúsculo
      tableName: 'veiculos', 
      freezeTableName: true, // Impede o Sequelize de tentar pluralizar ou alterar o nome
      timestamps: true,
      
      // [CORREÇÃO DO ERRO ATUAL]
      // O Sequelize busca 'createdAt' por padrão, mas sua migration criou 'created_at'.
      // Mapeamos a propriedade do JS para a coluna real do banco aqui:
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      
      underscored: false // Mantemos false pois seus outros campos (cooperadoId) não são underscored
    });
  }
}

export default Veiculo;