import mongoose from 'mongoose';

// Centralne połączenie z MongoDB używane przez serwer i seeder.
export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gamehub_forum';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`MongoDB połączone: ${mongoose.connection.host}`);
};
