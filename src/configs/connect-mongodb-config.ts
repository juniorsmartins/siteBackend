import mongoose from 'mongoose';

/**
* Promise da conexão em andamento. Evita que várias requisições simultâneas
* Uma promise representa “algo que vai terminar”, e várias partes do código podem esperar a mesma promise.
* (ex.: logo após o servidor acordar) disparem várias conexões ao mesmo tempo.
*/
let connecting: Promise<typeof mongoose> | null = null;

export const connectMongoDB = async (uri: string | undefined = process.env.DB_KEY): Promise<void> => {

    // 1. Já conectado: não faz nada (caminho comum, custo quase zero)
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // Lança um erro se a chave do banco de dados não estiver definida
    if (!uri) {
        throw new Error("A variável DB_KEY não está configurada no ambiente.");
    }

    // 2. Reaproveita a conexão em andamento ou inicia uma nova.
    // O finally limpa o cache: se falhar, a próxima requisição tenta de novo.
    connecting ??= mongoose
        .connect(uri, { serverSelectionTimeoutMS: 5000 }) // falha em 5s, e não em 30s
        .finally(() => {
            connecting = null;
        });

    await connecting;
}

