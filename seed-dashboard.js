import Sequelize from 'sequelize';
import config from './src/config/database.js';

// Importando os Models (Class Syntax)
import Cooperado from './src/models/cooperado.js';
import Producao from './src/models/Producao.js';
import Financeiro from './src/models/Financeiro.js';
import Armazem from './src/models/Armazem.js';
import Agendamento from './src/models/Agendamento.js';
import AtividadeCampo from './src/models/AtividadeCampo.js';

// 1. Instância do Sequelize (Replicando o que o server.js faz)
const sequelize = new Sequelize(config);

// 2. Inicialização dos Models
Cooperado.init(sequelize);
Producao.init(sequelize);
Financeiro.init(sequelize);
Armazem.init(sequelize);
Agendamento.init(sequelize);
AtividadeCampo.init(sequelize);

// 3. Associações (Crucial para as chaves estrangeiras funcionarem)
Cooperado.hasMany(Producao, { foreignKey: 'cooperadoId' });
Producao.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

Cooperado.hasMany(Financeiro, { foreignKey: 'cooperadoId' });
Financeiro.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

Cooperado.hasMany(Agendamento, { foreignKey: 'cooperadoId' });
Agendamento.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });
Armazem.hasMany(Agendamento, { foreignKey: 'armazemId' });
Agendamento.belongsTo(Armazem, { foreignKey: 'armazemId' });
Cooperado.hasMany(AtividadeCampo, { foreignKey: 'cooperadoId' });
AtividadeCampo.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

const runSeed = async () => {
    try {
        await sequelize.authenticate();
        console.log('🔌 Conectado ao banco de dados.');

        // --- CONFIGURAÇÃO ---
        // Coloque aqui o email de um usuário que JÁ EXISTE no seu banco
        const targetEmail = "juvenilpessoa01@gmail.com";
        // --------------------

        const user = await Cooperado.findOne({ where: { email: targetEmail } });

        if (!user) {
            console.error(`❌ Erro: Usuário com email '${targetEmail}' não encontrado.`);
            console.error("Dica: Crie um usuário no site primeiro, depois rode este script.");
            process.exit(1);
        }

        console.log(`👤 Inserindo dados para: ${user.nome_completo || user.nome} (ID: ${user.id})`);

        // Limpeza prévia (Opcional: evita duplicar dados se rodar 2x)
        await Financeiro.destroy({ where: { cooperadoId: user.id } });
        await Producao.destroy({ where: { cooperadoId: user.id } });

        await Agendamento.destroy({ where: { cooperadoId: user.id } });
        await AtividadeCampo.destroy({ where: { cooperadoId: user.id } });


        const [armazem1] = await Armazem.findOrCreate({
            where: { nome: 'Unidade Central - Grãos' },
            defaults: { localizacao: 'Rodovia PR-151, km 300', capacidade_hora: 20 }
        });

        const [armazem2] = await Armazem.findOrCreate({
            where: { nome: 'Unidade Leiteira Norte' },
            defaults: { localizacao: 'Zona Rural, Setor B', capacidade_hora: 15 }
        });

        console.log('🏭 Armazéns verificados.');




        // --- MASSA DE DADOS FINANCEIROS ---
        console.log('💸 Gerando lançamentos financeiros...');
        await Financeiro.bulkCreate([
            { cooperadoId: user.id, tipo: 'CREDITO', descricao: 'Venda Soja (Safra 23/24)', valor: 45000.00, data_movimento: '2023-11-01' },
            { cooperadoId: user.id, tipo: 'DEBITO', descricao: 'Compra Sementes Milho', valor: 12500.00, data_movimento: '2023-11-05' },
            { cooperadoId: user.id, tipo: 'CREDITO', descricao: 'Leite (Outubro)', valor: 8200.00, data_movimento: '2023-11-15' },
            { cooperadoId: user.id, tipo: 'DEBITO', descricao: 'Manutenção Trator', valor: 3400.00, data_movimento: '2023-11-20' },
            { cooperadoId: user.id, tipo: 'CREDITO', descricao: 'Adiantamento Custeio', valor: 15000.00, data_movimento: '2023-11-28' },
        ]);

        console.log('📅 Gerando agendamentos...');
        await Agendamento.bulkCreate([
            {
                cooperadoId: user.id,
                armazemId: armazem1.id,
                data_agendada: '2023-12-10',
                hora_agendada: 9, // 09:00
                status: 'CONCLUIDO',
                protocolo: 'AGRO-998877'
            },
            {
                cooperadoId: user.id,
                armazemId: armazem1.id,
                data_agendada: '2023-12-15', // Futuro
                hora_agendada: 14, // 14:00
                status: 'AGENDADO',
                protocolo: 'AGRO-112233'
            }
        ]);

        console.log('🌾 Gerando caderno de campo...');
        await AtividadeCampo.bulkCreate([
            {
                cooperadoId: user.id,
                tipo: 'PLANTIO',
                data_atividade: '2023-09-01',
                descricao: 'Plantio de Soja Intacta - Talhão 01',
                talhao: 'T-01'
            },
            {
                cooperadoId: user.id,
                tipo: 'PULVERIZACAO',
                data_atividade: '2023-10-15',
                descricao: 'Aplicação Fungicida Preventivo',
                talhao: 'T-01'
            }
        ]);
        console.log('✅ SEED COMPLETO: Logística e Campo populados.');


        // --- MASSA DE DADOS DE PRODUÇÃO (Para o Gráfico) ---
        console.log('🚜 Gerando histórico de produção...');
        // Datas retroativas para montar o gráfico de linha do tempo
        await Producao.bulkCreate([
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 4500, valor_unitario: 2.80, data_entrega: '2023-06-15', status_qualidade: 'A' },
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 4600, valor_unitario: 2.85, data_entrega: '2023-07-15', status_qualidade: 'A' },
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 4200, valor_unitario: 2.70, data_entrega: '2023-08-15', status_qualidade: 'B' },
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 4900, valor_unitario: 2.90, data_entrega: '2023-09-15', status_qualidade: 'A' },
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 5100, valor_unitario: 3.10, data_entrega: '2023-10-15', status_qualidade: 'A' },
            // Uma entrega recente de outra cultura
            { cooperadoId: user.id, tipo: 'SOJA', quantidade: 60000, valor_unitario: 135.00, data_entrega: '2023-11-25', status_qualidade: 'Padrão' },
        ]);

        console.log('✅ DADOS INJETADOS COM SUCESSO!');
        console.log('👉 Agora faça login no site e veja o Dashboard.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Falha fatal:', error);
        process.exit(1);
    }
};

runSeed();