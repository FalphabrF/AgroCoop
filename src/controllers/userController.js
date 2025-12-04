import Cooperado from '../models/cooperado.js'; // Garante PascalCase
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

// Função auxiliar para gerar hash
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); 
    return await bcrypt.hash(password, salt);
};

export const createUser = async (req, res) => {
    try {
        // 1. Validação básica de duplicidade
        const existingUser = await Cooperado.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).json({ erro: "E-mail já cadastrado neste sistema." });
        }

        // 2. Criptografar a senha antes de criar o objeto
        const passwordHash = await hashPassword(req.body.senha);

        const userToCreate = {
            id: crypto.randomUUID(),
            nome_completo: req.body.nome_completo, // Certifique-se que o name do input é 'nome_completo'
            cpf: req.body.cpf,
            data_nascimento: req.body.data_nascimento,
            telefone: req.body.telefone,
            endereco: req.body.endereco,
            cidade: req.body.cidade,
            estado: req.body.estado,
            cep: req.body.cep,
            tipo_cooperado: req.body.tipo_cooperado,
            email: req.body.email,
            numero_registro: req.body.numero_registro,
            foto: req.file ? req.file.filename : null,
            senha: passwordHash // <--- AQUI: Salva o hash, não a senha pura
        };

        const user = await Cooperado.create(userToCreate);

        // [CORREÇÃO EXPERT] 
        // Se o frontend usa fetch(), res.redirect() NÃO funciona como esperado (o fetch baixa o HTML).
        // Retornamos JSON 201 e o JavaScript do cliente faz o window.location.href
        return res.status(201).json({ 
            mensagem: "Cooperado criado com sucesso!",
            redirect: "/login.html"
        });

    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({
            erro: 'Erro interno ao criar cooperado',
            detalhe: error.message
        });
    }
};


// BUSCAR COOPERADO PELO ID (PRO PERFIL)
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Cooperado.findByPk(id, {
            attributes: { exclude: ['senha'] } // [SEGURANÇA] Nunca devolva a senha, nem criptografada
        });

        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        res.json(user);

    } catch (error) {
        console.error("ERRO REAL:", error);
        res.status(500).json({ erro: error.message });
    }
};
export const getProfile = async (req, res) => {
    try {
        const id = req.userId; // Vem do Middleware de Auth

        const user = await Cooperado.findByPk(id, {
            attributes: { exclude: ['senha'] } // Nunca devolva a senha
        });

        if (!user) {
            return res.status(404).json({ error: "Perfil não encontrado" });
        }

        return res.json(user);

    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return res.status(500).json({ error: "Erro interno ao carregar perfil" });
    }
};

// TODOS
export const getAllUsers = async (req, res) => {
    try {
        const users = await Cooperado.findAll({
            attributes: { exclude: ['senha'] } // [SEGURANÇA] Protege a lista de usuários
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar cooperados' });
    }
};


// DELETAR
export const deleteUser = async (req, res) => {
    try {
        await Cooperado.destroy({
            where: { id: req.params.id }
        });

        res.status(200).json({ mensagem: "Usuário deletado" });

    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar' });
    }
};