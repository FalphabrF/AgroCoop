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
        const existingUser = await Cooperado.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).json({ erro: "E-mail já cadastrado neste sistema." });
        }

        const passwordHash = await hashPassword(req.body.senha);

        const userToCreate = {
            id: crypto.randomUUID(),
            nome_completo: req.body.nome_completo,
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
            senha: passwordHash
        };

        const user = await Cooperado.create(userToCreate);

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

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Cooperado.findByPk(id, {
            attributes: { exclude: ['senha'] }
        });

        if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });
        res.json(user);
    } catch (error) {
        console.error("ERRO REAL:", error);
        res.status(500).json({ erro: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const id = req.userId; // Vem do Token
        const user = await Cooperado.findByPk(id, {
            attributes: { exclude: ['senha'] }
        });

        if (!user) return res.status(404).json({ error: "Perfil não encontrado" });
        return res.json(user);
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return res.status(500).json({ error: "Erro interno ao carregar perfil" });
    }
};

// [NOVO] Atualizar dados do próprio perfil
export const updateProfile = async (req, res) => {
    try {
        const id = req.userId;
        const user = await Cooperado.findByPk(id);

        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        // Filtra apenas campos permitidos para edição
        const { nome_completo, telefone, endereco, cidade, estado, cep } = req.body;

        await user.update({
            nome_completo,
            telefone,
            endereco,
            cidade,
            estado,
            cep
        });

        return res.json({ message: "Perfil atualizado!", user });
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
};

// [NOVO] Excluir a própria conta
export const deleteProfile = async (req, res) => {
    try {
        const id = req.userId;
        await Cooperado.destroy({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        return res.status(500).json({ error: "Erro ao excluir conta." });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await Cooperado.findAll({
            attributes: { exclude: ['senha'] }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar cooperados' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await Cooperado.destroy({ where: { id: req.params.id } });
        res.status(200).json({ mensagem: "Usuário deletado" });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar' });
    }
};