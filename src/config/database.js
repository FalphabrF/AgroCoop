import dotenv from 'dotenv';
dotenv.config();

export default {
  // Se existir a var DATABASE_URL (Produção), usa ela.
  // Se não, usa os dados individuais (Localhost)
  url: process.env.DATABASE_URL, 
  
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'juvenil',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'userdb',
  
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  
  // [CRÍTICO PARA RENDER] Configuração de SSL
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessário para certificados auto-assinados do Render
    }
  } : {}
};