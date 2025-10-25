import pool from './db.js'

// Função pra criar tabela
async function criarTabela() {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100),
      email VARCHAR(150)
    );
  `
  await pool.query(query)
  console.log('✅ Tabela criada!')
}

// Função pra inserir dados
async function inserirUsuario(nome, email) {
  const query = 'INSERT INTO usuarios (nome, email) VALUES ($1, $2)'
  await pool.query(query, [nome, email])
  console.log(`👤 Usuário ${nome} inserido!`)
}

// Função pra listar usuários
async function listarUsuarios() {
  const result = await pool.query('SELECT * FROM usuarios')
  console.log('📋 Usuários cadastrados:')
  console.table(result.rows)
}

// Executando tudo em sequência
async function main() {
  await criarTabela()
  await inserirUsuario('Juvena', 'juvena@email.com')
  await inserirUsuario('Carlos', 'carlos@email.com')
  await listarUsuarios()
  pool.end() // fecha a conexão
}

main().catch(console.error)