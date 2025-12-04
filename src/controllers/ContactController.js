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

    // 2. Configuração do Transporter (Quem envia)
    // Em produção, isso deveria estar em um arquivo de config separado,
    // mas para manter didático, vou deixar aqui.
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Ajuda em localhost, cuidado em produção
      }
    });

    try {
      // 3. Envio do E-mail
      await transporter.sendMail({
        from: `"Fale Conosco - AgroCoop" <${process.env.MAIL_USER}>`, // Remetente (tem que ser o autenticado)
        to: process.env.MAIL_USER, // Para onde vai o e-mail (você mesmo)
        replyTo: email, // Quando você clicar em "Responder", vai para o cliente
        subject: `Nova mensagem de: ${nome}`, // Assunto
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

      return res.status(200).json({ message: "E-mail enviado com sucesso!" });

    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).json({ error: "Falha ao enviar e-mail. Tente novamente mais tarde." });
    }
  }
}

export default new ContactController();