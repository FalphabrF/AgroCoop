import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class ContactController {
  async send(req, res) {
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("❌ ERRO FATAL: Credenciais de e-mail ausentes.");
      return res.status(500).json({ error: "Erro de configuração no servidor." });
    }

    // [FIX DE REDE AVANÇADO]
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Hardcoded é mais seguro que variável vazia aqui
      port: 587, // Voltamos para 587 (STARTTLS) - mais permissiva em containers
      secure: false, // false para 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        ciphers: 'SSLv3', // Compatibilidade
        rejectUnauthorized: false 
      },
      // [A MÁGICA ESTÁ AQUI]
      family: 4, // Força o Node a usar IPv4 (Resolve o ETIMEDOUT de IPv6)
      
      // Timeouts ajustados
      connectionTimeout: 10000, // 10s
      greetingTimeout: 5000,    // 5s
      socketTimeout: 20000,     // 20s
      logger: true,
      debug: false
    });

    try {
      console.log(`📨 Enviando (IPv4 Force) via ${process.env.MAIL_USER}...`);

      const info = await transporter.sendMail({
        from: `"Fale Conosco" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER, 
        replyTo: email, 
        subject: `Nova mensagem de: ${nome}`, 
        text: `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`,
        html: `
          <h3>AgroCoop - Nova Mensagem</h3>
          <p><strong>De:</strong> ${nome} (${email})</p>
          <hr>
          <p>${mensagem}</p>
        `
      });

      console.log("✅ Sucesso! ID:", info.messageId);
      return res.status(200).json({ message: "E-mail enviado com sucesso!" });

    } catch (error) {
      console.error("❌ Erro SMTP:", error);
      return res.status(500).json({ 
          error: "Não foi possível enviar o e-mail no momento.",
          detalhes: error.code // Retorna o código (ETIMEDOUT, EAUTH) para ajudar
      });
    }
  }
}

export default new ContactController();