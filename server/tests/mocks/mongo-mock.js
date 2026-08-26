export class MongoMemoryServer {
  
  static async create() {
    return new MongoMemoryServer();
  };

  getUri() {
    return "mongodb://127.0.0.1:27017/voltex_test_db";
  };

  async stop() {
    return true;
  };
};