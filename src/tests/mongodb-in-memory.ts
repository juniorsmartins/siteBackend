import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export async function connectInMemoryMongoDB(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}

export async function clearInMemoryMongoDB(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
}

export async function disconnectInMemoryMongoDB(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
    }
    await mongoServer?.stop();
}

