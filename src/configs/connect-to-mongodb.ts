import mongoose from 'mongoose';

export const connectToMongoDB = async (uriOverride = null) => {

    // 1. Se já estiver conectado, não faz nada
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // 2. Define a URI prioritariamente pelo argumento ou pelo ambiente
    const dbKey = uriOverride || process.env.DB_KEY;
    // Lança um erro se a chave do banco de dados não estiver definida
    if (!dbKey) {
        throw new Error("A variável DB_KEY não está configurada no ambiente.");
    }

    // 3. Connecta ao MongoDB
    await mongoose.connect(dbKey);
    console.log("Conectado ao MongoDB com sucesso.");
}

