import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

import Sequelize from 'sequelize';
import config from './config/database.js';

// --- IMPORTS DOS MODELS ---
// [FIX] Padronizado para PascalCase para evitar erros em sistemas Case-Sensitive (Linux/Render)
import Cooperado from './models/cooperado.js';
import Veiculo from './models/Veiculo.js';
import Producao from './models/Producao.js';
import Financeiro from './models/Financeiro.js';
import Armazem from './models/Armazem.js';
import Agendamento from './models/Agendamento.js';
import AtividadeCampo from './models/AtividadeCampo.js';

import userRoutes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------------
// ARQUIVOS ESTÁTICOS
// ----------------------------------------------------------------
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public/pages')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ----------------------------------------------------------------
// [FIX CRÍTICO] ROTA RAIZ (LOGIN)
// ----------------------------------------------------------------
// Deve vir ANTES das rotas da API para não ser bloqueada pelo Auth Middleware
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

// ----------------------------------------------------------------
// ROTAS DA API (Protegidas)
// ----------------------------------------------------------------
app.use(userRoutes);

// ----------------------------------------------------------------
// BANCO DE DADOS (SEQUELIZE)
// ----------------------------------------------------------------
// Lógica Híbrida: Usa DATABASE_URL com SSL no Render, ou config local no Windows
const sequelize = process.env.DATABASE_URL 
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        // [FIX CRÍTICO] Adicionando a configuração global para snake_case em produção
        define: {
            timestamps: true,
            underscored: true,
            underscoredAll: true
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
      })
    : new Sequelize(config);

// 1. Inicializar Models
Cooperado.init(sequelize);
Veiculo.init(sequelize);
Producao.init(sequelize);
Financeiro.init(sequelize);
Armazem.init(sequelize);
Agendamento.init(sequelize);
AtividadeCampo.init(sequelize);

// 2. Definir Associações (Relacionamentos)
// [CRÍTICO] Forçamos 'foreignKey' explicitamente para evitar erros de snake_case no Postgres

// Cooperado <-> Veículo
Cooperado.hasMany(Veiculo, { foreignKey: 'cooperadoId' });
Veiculo.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

// Cooperado <-> Produção
Cooperado.hasMany(Producao, { foreignKey: 'cooperadoId' });
Producao.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

// Cooperado <-> Financeiro
Cooperado.hasMany(Financeiro, { foreignKey: 'cooperadoId' });
Financeiro.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

// Cooperado <-> Agendamento (Logística)
Cooperado.hasMany(Agendamento, { foreignKey: 'cooperadoId' });
Agendamento.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

// Armazém <-> Agendamento
Armazem.hasMany(Agendamento, { foreignKey: 'armazemId' });
Agendamento.belongsTo(Armazem, { foreignKey: 'armazemId' });

// Cooperado <-> Atividade de Campo
Cooperado.hasMany(AtividadeCampo, { foreignKey: 'cooperadoId' });
AtividadeCampo.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

// ----------------------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR
// ----------------------------------------------------------------
sequelize.authenticate()
  .then(() => {
    console.log('✅ Banco conectado com sucesso!');
    if (process.env.DATABASE_URL) console.log('☁️  Rodando em modo PRODUÇÃO (Render)');
    else console.log('🏠 Rodando em modo DESENVOLVIMENTO (Local)');
    
    app.listen(3000, () => {
        console.log('🚀 Servidor ON em http://localhost:3000');
    });
  })
  .catch(err => {
    console.error('❌ Erro fatal ao conectar no banco:', err);
  });

// Middleware de Erro Global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;