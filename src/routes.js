import express from 'express'
import authMiddleware from './middlewares/auth.js';

import { 
  createUser, 
  deleteUser, 
  getAllUsers,
  getUserById,
  getProfile,
  updateProfile, // [NOVO]
  deleteProfile  // [NOVO]
} from './controllers/userController.js'

import upload from './config/multer.js'
import LoginController from './controllers/LoginController.js'
import VeiculoController from './controllers/VeiculoController.js'
import ContactController from './controllers/ContactController.js'
import DashboardController from './controllers/DashboardController.js'
import OperacionalController from './controllers/OperacionalController.js'
import FinanceiroController from './controllers/FinanceiroController.js'
import ProducaoController from './controllers/ProducaoController.js';

const router = express.Router()

// ==============================================================================
// 1. ROTAS PÚBLICAS (Sem Token)
// ==============================================================================
router.post('/usuarios/cadastro', upload.single('foto'), createUser)
router.post('/usuarios/login', LoginController.login)
router.post('/contato/enviar', ContactController.send)

// Vitrine pública de veículos
router.get('/usuarios/veiculos', VeiculoController.index); 

// ==============================================================================
// 2. BARREIRA DE SEGURANÇA (JWT)
// ==============================================================================
router.use(authMiddleware);

// ==============================================================================
// 3. ROTAS DE NEGÓCIO (Protegidas)
// ==============================================================================

// --- Dashboard & Perfil ---
router.get('/usuarios/dashboard', DashboardController.getDados); 
router.get('/usuarios/meu-perfil', getProfile);
router.put('/usuarios/meu-perfil', updateProfile); // [NOVO] Editar perfil
router.delete('/usuarios/meu-perfil', deleteProfile); // [NOVO] Excluir conta

router.get('/usuarios/meus-veiculos', VeiculoController.myVehicles);

// --- Veículos (CRUD Completo) ---
router.post('/usuarios/veiculos', upload.array('fotos', 10), VeiculoController.store);
router.get('/usuarios/veiculos/:id', VeiculoController.show);
router.put('/usuarios/veiculos/:id', VeiculoController.update);
router.delete('/usuarios/veiculos/:id', VeiculoController.delete);

// --- Gestão Operacional ---
router.get('/operacional/armazens', OperacionalController.indexArmazens);
router.post('/operacional/agendamento', OperacionalController.storeAgendamento);
router.post('/operacional/atividade', OperacionalController.storeAtividade);

// --- Produção e Financeiro ---
router.post('/producao/registro', ProducaoController.store);
router.post('/financeiro/lancamento', FinanceiroController.store);

// --- Administração ---
router.get('/usuarios/todos', getAllUsers);

// ==============================================================================
// 4. ROTAS DINÂMICAS GERAIS
// ==============================================================================
router.get('/usuarios/:id', getUserById);
router.delete('/usuarios/deletar/:id', deleteUser);

export default router;