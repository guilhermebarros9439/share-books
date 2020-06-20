import path from 'path';

// Knex config
module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite')
    },
    useNullAsDefault: true,
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    }
};