import Sequelize from 'sequelize';
import config from './src/config/database.js';
import crypto from 'crypto'; // [FIX] Import necessário para gerar UUID manualmente

// Importando os Models
import Cooperado from './src/models/cooperado.js';
import Veiculo from './src/models/Veiculo.js';
import Producao from './src/models/Producao.js';
import Financeiro from './src/models/Financeiro.js';
import Armazem from './src/models/Armazem.js';
import Agendamento from './src/models/Agendamento.js';
import AtividadeCampo from './src/models/AtividadeCampo.js';

// [FIX] Lógica de Conexão Híbrida (Local vs Produção)
let sequelize;

if (process.env.DATABASE_URL) {
    // ESTAMOS NO RENDER (Produção)
    console.log("🌍 Detectado ambiente de Produção (Render). Usando DATABASE_URL.");
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        // [CORREÇÃO CRÍTICA] Forçar o Sequelize a usar snake_case (created_at) em vez de camelCase
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Obrigatório para o Render
            }
        }
    });
} else {
    // ESTAMOS NO LOCALHOST (Windows)
    console.log("🏠 Detectado ambiente Local. Usando config padrão.");
    sequelize = new Sequelize(config);
}

// Inicialização dos Models
Cooperado.init(sequelize);
Veiculo.init(sequelize);
Producao.init(sequelize);
Financeiro.init(sequelize);
Armazem.init(sequelize);
Agendamento.init(sequelize);
AtividadeCampo.init(sequelize);

// Associações (Copiadas do server.js para garantir integridade)
Cooperado.hasMany(Veiculo, { foreignKey: 'cooperadoId' });
Veiculo.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

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
        console.log('🔌 Conectado ao banco de dados com sucesso.');

        // --- CONFIGURAÇÃO ---
        const targetEmail = "teste@teste.com"; 
        // --------------------

        // Tenta achar ou criar o usuário para não dar erro se o banco estiver vazio
        // Usei findOrCreate para garantir que o usuário exista em Produção
        const [user, created] = await Cooperado.findOrCreate({
            where: { email: targetEmail },
            defaults: {
                // [FIX] Gerar ID manualmente para evitar erro notNull no Postgres
                id: crypto.randomUUID(),
                // [CORREÇÃO] Removido 'nome' (não existe) e adicionados campos obrigatórios
                nome_completo: "Usuário Teste da Silva",
                cpf: "000.000.000-00",
                rg: "00.000.000-0", // Campo provável obrigatório
                data_nascimento: "1990-01-01", // [FIX] Campo que causou o erro
                senha: "senha_temporaria_hash_aqui", 
                telefone: "00000000",
                tipo_cooperado: "associado",
                endereco: "Rua Exemplo, 123", // Preenchendo defaults para evitar erro notNull
                cidade: "Cidade Teste",
                estado: "PR",
                cep: "00000-000",
                numero_registro: "12345",
                ativo: true,
                data_entrada: new Date()
            }
        });

        if(created) console.log("🆕 Usuário de teste criado automaticamente.");

        console.log(`👤 Alimentando dados para: ${user.nome_completo} (ID: ${user.id})`);

        // Limpeza prévia
        await Financeiro.destroy({ where: { cooperadoId: user.id } });
        await Producao.destroy({ where: { cooperadoId: user.id } });
        await Agendamento.destroy({ where: { cooperadoId: user.id } });
        // Não limpamos armazéns para não duplicar, usamos findOrCreate abaixo

        // --- INFRAESTRUTURA (ARMAZÉNS) ---
        const [armazem1] = await Armazem.findOrCreate({
            where: { nome: 'Unidade Central - Grãos' },
            defaults: { 
                id: crypto.randomUUID(), // [FIX] ID manual para armazém também
                localizacao: 'Rodovia PR-151, km 300', 
                capacidade_hora: 20 
            }
        });
        const [armazem2] = await Armazem.findOrCreate({
            where: { nome: 'Unidade Leiteira Norte' },
            defaults: { 
                id: crypto.randomUUID(), // [FIX] ID manual
                localizacao: 'Zona Rural, Setor B', 
                capacidade_hora: 15 
            }
        });

        // --- MASSA DE DADOS FINANCEIROS ---
        console.log('💸 Gerando financeiro...');
        await Financeiro.bulkCreate([
            { cooperadoId: user.id, tipo: 'CREDITO', descricao: 'Venda Soja (Safra 23/24)', valor: 45000.00, data_movimento: '2023-11-01' },
            { cooperadoId: user.id, tipo: 'DEBITO', descricao: 'Compra Sementes Milho', valor: 12500.00, data_movimento: '2023-11-05' },
            { cooperadoId: user.id, tipo: 'CREDITO', descricao: 'Leite (Outubro)', valor: 8200.00, data_movimento: '2023-11-15' },
            { cooperadoId: user.id, tipo: 'DEBITO', descricao: 'Manutenção Trator', valor: 3400.00, data_movimento: '2023-11-20' },
            { cooperadoId: user.id, tipo: 'CREDITO', descricao: 'Adiantamento Custeio', valor: 15000.00, data_movimento: '2023-11-28' },
        ]);

        // --- MASSA DE DADOS DE PRODUÇÃO ---
        console.log('🚜 Gerando produção...');
        await Producao.bulkCreate([
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 4500, valor_unitario: 2.80, data_entrega: '2023-06-15', status_qualidade: 'A' },
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 4600, valor_unitario: 2.85, data_entrega: '2023-07-15', status_qualidade: 'A' },
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 4200, valor_unitario: 2.70, data_entrega: '2023-08-15', status_qualidade: 'B' },
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 4900, valor_unitario: 2.90, data_entrega: '2023-09-15', status_qualidade: 'A' },
            { cooperadoId: user.id, tipo: 'LEITE', quantidade: 5100, valor_unitario: 3.10, data_entrega: '2023-10-15', status_qualidade: 'A' },
            { cooperadoId: user.id, tipo: 'SOJA', quantidade: 60000, valor_unitario: 135.00, data_entrega: '2023-11-25', status_qualidade: 'Padrão' },
        ]);

        // --- AGENDAMENTOS ---
        console.log('📅 Gerando agendamentos...');
        await Agendamento.bulkCreate([
            { cooperadoId: user.id, armazemId: armazem1.id, data_agendada: '2023-12-10', hora_agendada: 9, status: 'CONCLUIDO', protocolo: 'AGRO-SEED-01' },
            { cooperadoId: user.id, armazemId: armazem1.id, data_agendada: '2023-12-15', hora_agendada: 14, status: 'AGENDADO', protocolo: 'AGRO-SEED-02' }
        ]);

        console.log('✅ SEED EXECUTADO COM SUCESSO!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Falha fatal no Seed:', error);
        process.exit(1);
    }
};

runSeed();