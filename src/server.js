import express from 'express'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

import Sequelize from 'sequelize'
import config from './config/database.js'

// Importando Models (Certifique-se que os arquivos estão com letra Maiúscula)
import Cooperado from './models/cooperado.js';
import Veiculo from './models/Veiculo.js';
import Producao from './models/Producao.js';
import Financeiro from './models/Financeiro.js';
import Armazem from './models/Armazem.js';
import Agendamento from './models/Agendamento.js';
import AtividadeCampo from './models/AtividadeCampo.js';

import userRoutes from './routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ----------------------------------------------------------------
// [CORREÇÃO DO 404]
// ----------------------------------------------------------------

// 1. Serve arquivos estáticos gerais (CSS, JS, IMG)
app.use(express.static(path.join(__dirname, '../public')))

// 2. Serve a pasta 'pages' na raiz. 
// Isso faz o navegador encontrar 'inicial.html' mesmo ele estando dentro de 'public/pages'
app.use(express.static(path.join(__dirname, '../public/pages')))

// 3. Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ----------------------------------------------------------------

// Rotas da API
app.use(userRoutes)

// Rota raiz opcional (redireciona para login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages/login.html'))
})

// Banco de Dados
const sequelize = new Sequelize(config)

Cooperado.init(sequelize)
Veiculo.init(sequelize)
Producao.init(sequelize);
Financeiro.init(sequelize);
Armazem.init(sequelize);
Agendamento.init(sequelize);
AtividadeCampo.init(sequelize);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Banco conectado')
    console.log('📂 Servindo arquivos de: public/ e public/pages/')
    app.listen(3000, () => console.log('🚀 Servidor ON em http://localhost:3000'))
  })
  .catch(err => console.error('❌ Erro banco:', err))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: "Erro interno do servidor" })
})

export default app

Producao.init(sequelize);
Financeiro.init(sequelize);

// Associações (Adicione estas linhas para o Sequelize entender os JOINs)
Cooperado.hasMany(Producao, { foreignKey: 'cooperadoId' });
Producao.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

Cooperado.hasMany(Financeiro, { foreignKey: 'cooperadoId' });
Financeiro.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

Cooperado.hasMany(Agendamento, { foreignKey: 'cooperadoId' });
Agendamento.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });

Armazem.hasMany(Agendamento, { foreignKey: 'armazemId' });
Agendamento.belongsTo(Armazem, { foreignKey: 'armazemId' });

// NOVAS ASSOCIAÇÕES (Caderno de Campo)
Cooperado.hasMany(AtividadeCampo, { foreignKey: 'cooperadoId' });
AtividadeCampo.belongsTo(Cooperado, { foreignKey: 'cooperadoId' });