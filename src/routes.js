import express from 'express'
import authMiddleware from './middlewares/auth.js';

// [FIX] Imports padronizados (PascalCase para controllers)
import { 
  createUser, 
  deleteUser, 
  getAllUsers,
  getUserById,
  getProfile
} from './controllers/UserController.js' // Verifique se o arquivo físico é UserController.js

import upload from './config/multer.js'
import LoginController from './controllers/LoginController.js'
import VeiculoController from './controllers/VeiculoController.js'
import ContactController from './controllers/ContactController.js'
import DashboardController from './controllers/DashboardController.js'
import OperacionalController from './controllers/OperacionalController.js'
import FinanceiroController from './controllers/FinanceiroController.js'

const router = express.Router()

// ==============================================================================
// 1. ROTAS PÚBLICAS (Acesso livre sem Token)
// ==============================================================================

// Autenticação e Registro
router.post('/usuarios/cadastro', upload.single('foto'), createUser)
router.post('/usuarios/login', LoginController.login)

// Contato (Público)
router.post('/contato/enviar', ContactController.send)


// ==============================================================================
// 2. BARREIRA DE SEGURANÇA (JWT)
// ==============================================================================
// Todas as rotas abaixo desta linha exigem Header 'Authorization: Bearer <token>'
router.use(authMiddleware);


// ==============================================================================
// 3. ROTAS PROTEGIDAS ESPECÍFICAS (Alta Prioridade)
// ==============================================================================
// Estas rotas DEVEM vir antes de rotas dinâmicas (/:id) para evitar conflitos.

// --- Dashboard (Ociosa a rota mais acessada) ---
router.get('/usuarios/dashboard', DashboardController.getDados); 

router.get('/usuarios/meu-perfil', getProfile);

// --- Listagens Gerais ---
router.get('/usuarios/todos', getAllUsers)

// --- Operacional e Financeiro ---
router.post('/operacional/agendamento', OperacionalController.storeAgendamento);
router.post('/operacional/atividade', OperacionalController.storeAtividade);
router.post('/financeiro/lancamento', FinanceiroController.store);

// --- Veículos (Escrita) ---
router.post('/usuarios/veiculos', upload.array('fotos', 10), VeiculoController.store)


// ==============================================================================
// 4. ROTAS PROTEGIDAS DINÂMICAS (Baixa Prioridade / Catch-All)
// ==============================================================================
// Rotas que recebem parâmetros (/:id). O Express só deve chegar aqui se não 
// encontrar nenhuma rota específica acima.

// Veículos por ID
router.get('/usuarios/veiculos/:id', VeiculoController.index) // Lista todos os veículos

router.put('/usuarios/veiculos/:id', VeiculoController.update)
router.delete('/usuarios/veiculos/:id', VeiculoController.delete)
// Se precisar ver um veículo específico:
router.get('/usuarios/veiculos/:id', VeiculoController.show) 

// Usuários por ID (PERIGO: Catch-All)
// Esta rota captura qualquer GET /usuarios/QUALQUER_COISA
// Por isso ela é estritamente a ÚLTIMA rota GET de usuários.
router.get('/usuarios/:id', getUserById)

router.delete('/usuarios/deletar/:id', deleteUser)

export default router