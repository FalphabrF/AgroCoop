import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

class ContactController {
  async send(req, res) {
    const { nome, email, mensagem } = req.body;

    // 1. Validação Básica
    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    // 2. [FIX] Configuração Robusta para Cloud (Render/AWS)
    // O problema de "carregando infinito" acontece porque a porta 587 é bloqueada ou lenta na nuvem.
    // Forçamos a porta 465 (SSL) e adicionamos timeouts para não travar o servidor.
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: 465, // Força SSL (Secure Socket Layer)
      secure: true, // Obrigatório para porta 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // Configurações vitais para não travar a requisição (Hanging)
      connectionTimeout: 10000, // 10s para conectar
      greetingTimeout: 5000,    // 5s para o Hello
      socketTimeout: 15000,     // 15s de inatividade
      logger: true,             // Mostra o log detalhado no Dashboard do Render
      debug: false
    });

    try {
      console.log(`Tentando enviar e-mail via ${process.env.MAIL_USER}...`);

      // 3. Envio do E-mail
      await transporter.sendMail({
        from: `"Fale Conosco - AgroCoop" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER, 
        replyTo: email, 
        subject: `Nova mensagem de: ${nome}`, 
        text: `
          Nome: ${nome}
          E-mail: ${email}
          
          Mensagem:
          ${mensagem}
        `,
        html: `
          <h3>Nova mensagem do site AgroCoop</h3>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <hr>
          <p><strong>Mensagem:</strong><br> ${mensagem}</p>
        `
      });

      console.log("✅ E-mail despachado com sucesso!");
      return res.status(200).json({ message: "E-mail enviado com sucesso!" });

    } catch (error) {
      console.error("❌ Erro CRÍTICO ao enviar e-mail:", error);
      // Retorna erro 500 imediato para o frontend destravar o botão
      return res.status(500).json({ 
          error: "Falha ao enviar e-mail. Tente novamente mais tarde.",
          detalhes: error.message 
      });
    }
  }
}

export default new ContactController();