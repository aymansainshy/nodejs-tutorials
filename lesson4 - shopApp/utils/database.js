const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const dbUrl = 'mongodb+srv://ayman:ayman123@ayman.4gnhj.mongodb.net/Shop-database?retryWrites=true&w=majority';

const mongoConnect = (callback) => {
    MongoClient.connect(dbUrl).then(client => {
        console.log('Connected ...');
        _db = client.db();
        callback();
    }).catch(err => {
        console.log(err);
        throw err;
    });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database Found !';
}

// module.exports = mongoConnect;

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;



