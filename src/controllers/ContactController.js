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

    // [FIX FINAL] Usando o preset 'service: gmail'
    // Isso abstrai a porta e o host, usando as configurações ideais conhecidas pelo Nodemailer.
    // Se isso falhar, o Google está bloqueando o IP do Render irrevogavelmente.
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      logger: true,
      debug: true // Debug completo ativado
    });

    try {
      console.log(`📨 Enviando via Serviço Gmail (${process.env.MAIL_USER})...`);

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
      
      // Feedback técnico para você no frontend
      return res.status(500).json({ 
          error: "Erro de conexão com o Gmail.",
          detalhes: "O Google pode estar bloqueando o IP do servidor. Considere usar uma API de E-mail." 
      });
    }
  }
}

export default new ContactController();