import Veiculo from '../models/Veiculo.js';

class VeiculoController {

  // Cadastrar
  async store(req, res) {
    try {
      // [SEGURANÇA] Pega o ID do Token JWT
      const cooperadoId = req.userId;
      if (!cooperadoId) {
        return res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
      }

      const {
        modelo,
        placa,
        marca,
        ano,
        localizacao,
        valor,
        quilometragem,
        opcionais,
        descricao,
        telefone
      } = req.body;

      // [ADAPTAÇÃO] O Banco espera 'foto_principal' (String), não array.
      // Pegamos a primeira foto do array para salvar.
      let foto_principal = null;
      if (req.files && req.files.length > 0) {
        foto_principal = req.files[0].filename;
      }

      const veiculo = await Veiculo.create({
        cooperadoId, // [FIX] Vínculo Obrigatório
        modelo,
        placa,
        marca,
        ano,
        localizacao,
        valor,
        quilometragem,
        opcionais,
        descricao,
        telefone,
        foto_principal // [FIX] Campo correto do banco
      });

      return res.status(201).json(veiculo);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: "Erro ao cadastrar veículo",
        detalhes: error.message
      });
    }
  }

   async myVehicles(req, res) {
    try {
      const cooperadoId = req.userId; // Vem do Token

      const veiculos = await Veiculo.findAll({
        where: { cooperadoId }, // Filtro de segurança
        order: [['created_at', 'DESC']]
      });

      return res.json(veiculos);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar seus veículos" });
    }
  }

 

  // Listar todos
  async index(req, res) {
    try {
      const veiculos = await Veiculo.findAll({
        order: [['created_at', 'DESC']]
      });
      return res.json(veiculos);
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao listar veículos",
        detalhes: error.message
      });
    }
  }

  // Buscar por ID
  async show(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findByPk(id);

      if (!veiculo) {
        return res.status(404).json({ erro: "Veículo não encontrado" });
      }

      return res.json(veiculo);
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao buscar veículo",
        detalhes: error.message
      });
    }
  }

  // Atualizar
  async update(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findByPk(id);

      if (!veiculo) {
        return res.status(404).json({ erro: "Veículo não encontrado" });
      }

      // Segurança: verificar se o veículo pertence ao usuário que está tentando editar
      // if (veiculo.cooperadoId !== req.userId) return res.status(403).json({ error: "Sem permissão" });

      await veiculo.update(req.body);

      return res.json(veiculo);
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao atualizar veículo",
        detalhes: error.message
      });
    }
  }

  // Deletar
  async delete(req, res) {
    try {
      const { id } = req.params;
      const veiculo = await Veiculo.findByPk(id);

      if (!veiculo) {
        return res.status(404).json({ erro: "Veículo não encontrado" });
      }

      // Segurança opcional: checar dono
      // if (veiculo.cooperadoId !== req.userId) return res.status(403).json({ error: "Sem permissão" });

      await veiculo.destroy();

      return res.status(204).send();

    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao deletar veículo",
        detalhes: error.message
      });
    }
  }
}

export default new VeiculoController();