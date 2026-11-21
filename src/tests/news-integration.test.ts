import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { newsRepository } from '../repositories/news-repository.ts';
import { MESSAGES_ERROR } from '../errors/messages-error.ts';
import { connectInMemoryMongoDB, clearInMemoryMongoDB, disconnectInMemoryMongoDB } from './mongodb-in-memory.ts';
import { newsCreateFactory } from './factories.ts';
import { app } from '../server.ts';

describe('News Integration Tests', () => {

    beforeAll(connectInMemoryMongoDB);
    afterEach(clearInMemoryMongoDB);
    afterAll(disconnectInMemoryMongoDB);

    describe('Get', () => {

        it('Deve buscar uma notícia com sucesso.', async () => {

            const newsInput = newsCreateFactory();
            const newsCreated = await newsRepository.create(newsInput);

            const response = await request(app)
                .get(`/v1/news/${newsCreated._id}`);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);
            expect(response.body).toMatchObject({
                _id: String(newsCreated._id),
                chapeu: newsInput.chapeu,
                titulo: newsInput.titulo,
                linhaFina: newsInput.linhaFina,
                conteudo: newsInput.conteudo,
                autor: newsInput.autor,
                imagemUrl: newsInput.imagemUrl,
                imagemLegenda: newsInput.imagemLegenda,
                linkOriginal: newsInput.linkOriginal,
                destaquePrincipal: newsInput.destaquePrincipal,
                destaqueSecundario: newsInput.destaqueSecundario,
                editoria: newsInput.editoria
            });
        });

    });
});