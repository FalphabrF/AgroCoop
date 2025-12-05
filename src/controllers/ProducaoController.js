import Producao from '../models/Producao.js';

class ProducaoController {
    
    // POST /producao/registro
    async store(req, res) {
        try {
            const { cooperadoId, tipo, quantidade, data, qualidade } = req.body;

            // Validação básica
            if (!tipo || !quantidade || !data) {
                return res.status(400).json({ error: "Dados incompletos" });
            }

            const novaProducao = await Producao.create({
                cooperadoId,
                tipo, // 'LEITE', 'SOJA', etc.
                quantidade: parseFloat(quantidade),
                data_entrega: data,
                status_qualidade: qualidade || 'Padrão',
                valor_unitario: 0.00 // Será calculado pelo sistema financeiro depois
            });

            return res.status(201).json(novaProducao);

        } catch (error) {
            console.error("Erro produção:", error);
            return res.status(500).json({ error: "Erro ao registrar produção" });
        }
    }
}

export default new ProducaoController();