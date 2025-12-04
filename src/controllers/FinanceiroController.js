import Financeiro from '../models/Financeiro.js';

class FinanceiroController {
    
    // POST /financeiro/lancamento
    async store(req, res) {
        try {
            const { cooperadoId, tipo, descricao, valor, data } = req.body;

            // Validação básica
            if (!['CREDITO', 'DEBITO'].includes(tipo)) {
                return res.status(400).json({ error: "Tipo de lançamento inválido" });
            }

            const lancamento = await Financeiro.create({
                cooperadoId,
                tipo, // 'CREDITO' ou 'DEBITO'
                descricao,
                valor, // O banco espera DECIMAL (ex: 150.50)
                data_movimento: data
            });

            return res.status(201).json(lancamento);

        } catch (error) {
            console.error("Erro financeiro:", error);
            return res.status(500).json({ error: "Erro ao registrar movimentação" });
        }
    }
}

export default new FinanceiroController();