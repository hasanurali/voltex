import mongoose from "mongoose";

import { MongoMemoryServer } from "./mocks/mongo-mock.js";


let mongoServer;

beforeAll(async () => {

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    autoIndex: true
  });
});

beforeEach(async () => {

  if (mongoose.connection.readyState === 1) {

    const collections = mongoose.connection.collections;

    for (const key in collections) {
      await collections[key].deleteMany();
    };

  };
});

afterAll(async () => {

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  };

  if (mongoServer) {
    await mongoServer.stop();
  };
});
