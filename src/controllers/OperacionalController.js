import Agendamento from '../models/Agendamento.js';
import Armazem from '../models/Armazem.js'; // Importante: Importar o model Armazem

import AtividadeCampo from '../models/AtividadeCampo.js';
import Cooperado from '../models/cooperado.js';
import crypto from 'crypto';

class OperacionalController {
    
    // POST /operacional/agendamento
    async indexArmazens(req, res) {
        try {
            const armazens = await Armazem.findAll({
                attributes: ['id', 'nome'] // Retorna apenas o necessário para o <select>
            });
            return res.json(armazens);
        } catch (error) {
            console.error("Erro ao listar armazéns:", error);
            return res.status(500).json({ error: "Erro ao listar armazéns" });
        }
    }
    
    
    async storeAgendamento(req, res) {
        try {
            const { cooperadoId, armazemId, data, hora } = req.body;

            // Gera um protocolo único (Ex: AGRO-A1B2)
            const protocolo = `AGRO-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

            const agendamento = await Agendamento.create({
                cooperadoId,
                armazemId,
                data_agendada: data,
                hora_agendada: hora,
                status: 'AGENDADO',
                protocolo
            });

            return res.status(201).json(agendamento);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao criar agendamento" });
        }
    }

    // POST /operacional/atividade
    async storeAtividade(req, res) {
        try {
            const { cooperadoId, tipo, data, talhao, descricao } = req.body;

            const atividade = await AtividadeCampo.create({
                cooperadoId,
                tipo, // PLANTIO, PULVERIZACAO, COLHEITA
                data_atividade: data,
                talhao,
                descricao
            });

            return res.status(201).json(atividade);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao registrar atividade" });
        }
    }
}

export default new OperacionalController();