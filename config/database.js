const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const createDatabase = async () => await MongoMemoryServer.create({
  instance: {
    port:
        process.env.NODE_ENV === 'test'
          ? process.env.TEST_DB_PORT ?? 3124
          : process.env.DB_PORT ?? 3123,
  },
});

(async () => {
  const database = await createDatabase();
  const uri = database.getUri();

  console.log('database uri:', uri);

  await mongoose.connect(database.getUri(), {
    dbName: 'boo-coding-assignment-dev',
  });
})();
