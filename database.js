const { MongoClient } = require('mongodb');
const { DB_USER, DB_PASS } = require('./config');

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASS}@lab7-cluster.h1jfrek.mongodb.net/?retryWrites=true&w=majority&appName=lab7-cluster`;

let database;

async function mongoConnect(callback) {
    try {
        const client = await MongoClient.connect(connectionString);
        database = client.db('shop');
        console.log('Connection to the database has been established.');
        callback();
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

function getDatabase() {
    if (!database) {
        throw new Error('No database found.');
    }
    return database;
}

module.exports = {
    mongoConnect,
    getDatabase
};