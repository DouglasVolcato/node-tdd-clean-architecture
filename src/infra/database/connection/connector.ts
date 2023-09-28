import mongoose from "mongoose";

export class DatabaseConnector {
  public async connect(databaseUrl: string): Promise<void> {
    await mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}
