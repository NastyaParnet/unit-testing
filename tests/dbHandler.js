const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();

  await mongoose.connect(uri, {
    dbName: 'verifyMongooseSprint'
  });
};

module.exports.closeDatabase = async () => {
  await mongod.stop();
  await mongoose.connection.close();
};

module.exports.clearDatabase = async () => {
  const { collections } = mongoose.connection;

  Object.keys(collections).forEach(async key => {
    const collection = collections[key];
    await collection.deleteMany();
  });
};

module.exports.disconnect = async () => {
  await mongoose.disconnect();
};
