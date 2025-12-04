import Cooperado from '../models/cooperado.js'; // Garante PascalCase
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

class LoginController {
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            // 1. Validação de Entrada
            if (!email || !senha) {
                return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
            }

            // 2. Busca o usuário
            const user = await Cooperado.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ error: "Credenciais inválidas." });
            }

            // 3. Comparação de Senha (com fallback para legado)
            let senhaCorreta = false;
            try {
                senhaCorreta = await bcrypt.compare(senha, user.senha);
            } catch (err) {
                // Fallback para senhas antigas em texto puro (apenas em transição)
                if (user.senha === senha) {
                    senhaCorreta = true;
                }
            }

            if (!senhaCorreta) {
                return res.status(401).json({ error: "Credenciais inválidas." });
            }

            // 4. [CRÍTICO] GERAÇÃO DO TOKEN JWT
            // O erro estava aqui: você não estava chamando jwt.sign
            const token = jwt.sign({ id: user.id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            });

            // 5. Resposta com o Token
            return res.json({
                message: "Login realizado com sucesso",
                user: {
                    id: user.id,
                    nome: user.nome_completo || user.nome, // Garante pegar o nome correto
                    email: user.email,
                    foto: user.foto
                },
                token: token // <--- O FRONTEND PRECISA DISSO AQUI
            });

        } catch (error) {
            console.error("ERRO NO LOGIN:", error);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }
    }
}

export default new LoginController();