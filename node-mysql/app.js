// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sicoob',
});

try {
  const [results, fields] = await connection.query(
    'SELECT * FROM `cooperados`  '
  );

  console.log(results); // results contains rows returned by server
  console.log(fields); // fields contains extra meta data about results, if available
} catch (err) {
  console.log(err);
}

