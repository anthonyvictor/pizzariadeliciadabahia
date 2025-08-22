import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

export async function conectarDB() {
  if (global._mongoosePromise) {
    return global._mongoosePromise;
  }

  const MONGO_URI = process.env.DATABASE_URL!;
  if (!MONGO_URI) throw new Error("⚠️ MONGO_URI não definida no .env");

  console.info("🔌 Conectando ao MongoDB...");
  global._mongoosePromise = mongoose.connect(MONGO_URI, {
    bufferCommands: false,
  });

  const conn = await global._mongoosePromise;
  console.info("✅ MongoDB conectado:", mongoose.connection.name);

  return conn;
}
