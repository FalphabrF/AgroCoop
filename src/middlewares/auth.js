import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Verifica se o token foi enviado
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // O formato é "Bearer <token>"
    const [, token] = authHeader.split(' ');

    try {
        // 2. Decodifica e valida a assinatura
        const decoded = await jwt.verify(token, authConfig.secret);

        // 3. INJEÇÃO DE ID (A mágica da segurança)
        // Adicionamos o ID do usuário dentro da requisição.
        // A partir de agora, os controllers não precisam pegar ID da URL, pegam daqui.
        req.userId = decoded.id;

        return next(); // Pode passar

    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};