// db.js
const mysql = require('mysql2');

const { Pool } = require('pg'); // Importa o pacote PostgreSQL

// Configuração da pool de conexões
const pool = new Pool({
    connectionString: 'postgresql://miguel:tVyu99bEvN21BIPjpHEIdnUyfLEWKqBs@dpg-ct1k8k5umphs738qj38g-a.oregon-postgres.render.com/bdescola_8h4f',
    ssl: {
        rejectUnauthorized: false, // Necessário para conexões seguras no Render
    },
});

module.exports = pool; // Exporta a pool para ser usada em outras partes da aplicação
