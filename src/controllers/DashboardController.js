import Producao from '../models/Producao.js';
import Financeiro from '../models/Financeiro.js';
import Cooperado from '../models/cooperado.js';
import Agendamento from '../models/Agendamento.js';
import AtividadeCampo from '../models/AtividadeCampo.js';
import Armazem from '../models/Armazem.js';

class DashboardController {
    async getDados(req, res) {
        try {
            // [CORREÇÃO CRÍTICA DE SEGURANÇA]
            // Antes: const { id } = req.params; (Buscava da URL, inseguro e agora indefinido)
            // Agora: Pegamos o ID injetado pelo Middleware de Autenticação (Token)
            const id = req.userId; 

            // [DEBUG] Verifique no terminal se o ID está chegando
            console.log(`Dashboard solicitado pelo usuário ID: ${id}`);

            if (!id) {
                return res.status(400).json({ error: "ID do usuário não identificado no token." });
            }

            // Validação de segurança: verificar se cooperado existe
            const cooperado = await Cooperado.findByPk(id);
            if (!cooperado) {
                return res.status(404).json({ error: "Cooperado não encontrado" });
            }

            // 1. Cálculo Financeiro
            const lancamentos = await Financeiro.findAll({ 
                where: { cooperadoId: id },
                order: [['data_movimento', 'DESC']]
            });
            
            let saldo = 0;
            lancamentos.forEach(l => {
                const valor = parseFloat(l.valor);
                if(l.tipo === 'CREDITO') saldo += valor;
                else saldo -= valor;
            });

            // 2. Busca Produção Recente
            const producoes = await Producao.findAll({ 
                where: { cooperadoId: id },
                order: [['data_entrega', 'DESC']],
                limit: 6
            });

            // 3. Simulação de Cota Capital
            const cotaCapital = (saldo * 0.2) + 5000; 

            // 4. Buscar Agendamentos (Logística)
            const agendamentos = await Agendamento.findAll({
                where: { cooperadoId: id },
                include: [{ model: Armazem, attributes: ['nome'] }],
                order: [['data_agendada', 'ASC']],
                limit: 3
            });

            // 5. Buscar Caderno de Campo
            const atividades = await AtividadeCampo.findAll({
                where: { cooperadoId: id },
                order: [['data_atividade', 'DESC']],
                limit: 4
            });

            return res.json({
                financeiro: {
                    saldo_atual: saldo.toFixed(2),
                    cota_capital: cotaCapital.toFixed(2),
                    lancamentos_recentes: lancamentos.slice(0, 5)
                },
                producao: {
                    historico: producoes.reverse()
                },
                logistica: agendamentos,
                campo: atividades
            });

        } catch (error) {
            console.error("Erro CRÍTICO no DashboardController:", error);
            // Isso ajuda a ver o erro real no terminal
            return res.status(500).json({ error: "Erro interno ao processar dashboard", detalhe: error.message });
        }
    }
}

export default new DashboardController();