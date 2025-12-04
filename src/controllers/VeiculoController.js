import Veiculo from '../models/Veiculo.js'
import { v4 as uuidv4 } from "uuid";


class VeiculoController {

  // Cadastrar
  async store(req, res) {
    try {
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
      } = req.body

      // Se enviar fotos via multer
      const fotos = req.files ? req.files.map(file => file.filename) : []

      const veiculo = await Veiculo.create({
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
        fotos
      })

      return res.status(201).json(veiculo)

    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao cadastrar veículo",
        detalhes: error.message
      })
    }
  }

  // Listar todos
  async index(req, res) {
    try {
      const veiculos = await Veiculo.findAll()

      return res.json(veiculos)
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao listar veículos",
        detalhes: error.message
      })
    }
  }

  // Buscar por ID
  async show(req, res) {
    try {
      const { id } = req.params

      const veiculo = await Veiculo.findByPk(id)

      if (!veiculo) {
        return res.status(404).json({ erro: "Veículo não encontrado" })
      }

      return res.json(veiculo)
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao buscar veículo",
        detalhes: error.message
      })
    }
  }

  // Atualizar
  async update(req, res) {
    try {
      const { id } = req.params

      const veiculo = await Veiculo.findByPk(id)

      if (!veiculo) {
        return res.status(404).json({ erro: "Veículo não encontrado" })
      }

      await veiculo.update(req.body)

      return res.json(veiculo)
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao atualizar veículo",
        detalhes: error.message
      })
    }
  }

  // Deletar
  async delete(req, res) {
    try {
      const { id } = req.params

      const veiculo = await Veiculo.findByPk(id)

      if (!veiculo) {
        return res.status(404).json({ erro: "Veículo não encontrado" })
      }

      await veiculo.destroy()

      return res.status(204).send()

    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao deletar veículo",
        detalhes: error.message
      })
    }
  }

}

export default new VeiculoController()