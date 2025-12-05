import Sequelize from 'sequelize';
import config from './src/config/database.js';

const sequelize = new Sequelize(config);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("🔌 Conectado. Analisando Schema...\n");

        // Query bruta para listar tabelas e colunas do Postgres
        const [results] = await sequelize.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            ORDER BY table_name, column_name;
        `);

        console.log("====== RAIO-X DO BANCO DE DADOS ======");
        let currentTable = '';
        results.forEach(row => {
            if (row.table_name !== currentTable) {
                console.log(`\n📦 TABELA: [ ${row.table_name} ]`);
                currentTable = row.table_name;
            }
            console.log(`   └─ 🔑 Coluna: ${row.column_name} (${row.data_type})`);
        });
        console.log("\n======================================");
        
        process.exit(0);
    } catch (e) {
        console.error("Erro:", e);
    }
})();