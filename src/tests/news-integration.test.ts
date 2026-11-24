import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server.ts';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { newsRepository } from '../repositories/news-repository.ts';
import { connectInMemoryMongoDB, clearInMemoryMongoDB, disconnectInMemoryMongoDB } from './mongodb-in-memory.ts';
import { newsFactory } from './factories.ts';
import { MESSAGES_ERROR } from '../errors/messages-error.ts';
import { MESSAGES_SUCCESS } from '../configs/messages-success-config.ts';
import { NEWS_RULES } from "../configs/constants-config.ts"; 

describe('News Integration Tests', () => {

    beforeAll(connectInMemoryMongoDB);
    afterEach(clearInMemoryMongoDB);
    afterAll(disconnectInMemoryMongoDB);

    describe('FindById', () => {

        it('Deve buscar uma notícia com sucesso.', async () => {

            const newsInput = newsFactory();
            const newsCreated = await newsRepository.create(newsInput);

            const response = await request(app)
                .get(`/v1/news/${newsCreated._id}`);

            expect(response.status).toBe(200);
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
            expect(response.headers['content-type']).toMatch(/application\/json/);
        });
        
        it('Deve lançar erro 400 por ID inválido.', async () => {

            const response = await request(app)
                .get(`/v1/news/${'id-invalido'}`);

            expect(response.status).toBe(400);
            expect(response.body).toContain(MESSAGES_ERROR.GENERAL.INVALID_ID);

        });

        it('Deve lançar erro 404 por ID não encontrado.', async () => {
            const idValidoInexistente = new mongoose.Types.ObjectId();

            const response = await request(app)
                .get(`/v1/news/${idValidoInexistente}`);
                
            expect(response.status).toBe(404);
            expect(response.body).toContain(MESSAGES_ERROR.NEWS.NOT_FOUND);
        });
    });

    describe('DeleteById', () => {

        it('Deve deletar uma notícia com sucesso.', async () => {
            const newsInput = newsFactory();
            const newsCreated = await newsRepository.create(newsInput);

            const response = await request(app)
                .delete(`/v1/news/${newsCreated._id}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toContain(MESSAGES_SUCCESS.NEWS.DELETED);
            expect(response.body.idDeleted).toContain(newsCreated._id);
        });

        it('Deve lançar erro 400 por ID inválido.', async () => {

            const response = await request(app)
                .delete(`/v1/news/${'id-invalido'}`);

            expect(response.status).toBe(400);
            expect(response.body).toContain(MESSAGES_ERROR.GENERAL.INVALID_ID);
        });

        it('Deve lançar erro 404 por ID não encontrado.', async () => {
            const idValidoInexistente = new mongoose.Types.ObjectId();

            const response = await request(app)
                .delete(`/v1/news/${idValidoInexistente}`);

            expect(response.status).toBe(404);
            expect(response.body).toContain(MESSAGES_ERROR.NEWS.NOT_FOUND);
        });
    });

    describe('Create', () => {

        it('Deve criar uma notícia com sucesso.', async () => {
            const newsInput = newsFactory();

            const response = await request(app)
                .post('/v1/news')
                .send(newsInput);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toMatchObject({
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
            expect(response.body).toHaveProperty('createdAt');
            expect(response.body).toHaveProperty('updatedAt');
            expect(response.headers['content-type']).toMatch(/application\/json/);

        });

        it('Deve lançar erro 400 por dados inválidos - Schema Validation.', async () => {
            const newsInput = newsFactory();
            newsInput.chapeu = 'C2tre T78911 Yasd43gpoer Ghut'; // Tornando o chapéu inválido para gerar erro 400
            newsInput.titulo = 'T'; // Tornando o título inválido para gerar erro 400
            newsInput.linhaFina = 'L'; // Tornando a linha fina inválida para gerar erro 400

            const response = await request(app)
                .post('/v1/news')
                .send(newsInput);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(MESSAGES_ERROR.GENERAL.DATA_VALIDATION_ERRORS);
            expect(response.body.issues.properties["chapeu"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_HAT_MAX_CARACTERES(NEWS_RULES.HAT.MAX));
            expect(response.body.issues.properties["titulo"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_TITLE_MIN_CARACTERES(NEWS_RULES.TITLE.MIN));
            expect(response.body.issues.properties["linhaFina"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_SUBHEADLINE_MIN_CARACTERES(NEWS_RULES.SUBHEADLINE.MIN));
        });
    });

    describe('UpdateById', () => {

        it('Deve atualizar uma notícia com sucesso.', async () => {
            const newsInput = newsFactory();
            const newsCreated = await newsRepository.create(newsInput);

            const newsUpdate = newsFactory({ 
                chapeu: 'Chapéu Atualizado', 
                titulo: 'Título Atualizado', 
                linhaFina: 'Linha Fina Atualizada', 
                conteudo: 'Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado', 
                autor: 'Autor Atualizado', 
                imagemUrl: 'URL Atualizada', 
                imagemLegenda: 'Legenda Atualizada', 
                linkOriginal: 'Link Atualizado', 
                destaquePrincipal: true, 
                destaqueSecundario: true, 
                editoria: 'esportes' 
            });

            const response = await request(app)
                .put(`/v1/news/${newsCreated._id}`)
                .send(newsUpdate);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                chapeu: newsUpdate.chapeu,
                titulo: newsUpdate.titulo,
                linhaFina: newsUpdate.linhaFina,
                conteudo: newsUpdate.conteudo,
                autor: newsUpdate.autor,
                imagemUrl: newsUpdate.imagemUrl,
                imagemLegenda: newsUpdate.imagemLegenda,
                linkOriginal: newsUpdate.linkOriginal,
                destaquePrincipal: newsUpdate.destaquePrincipal,
                destaqueSecundario: newsUpdate.destaqueSecundario,
                editoria: newsUpdate.editoria
            });
            expect(response.headers['content-type']).toMatch(/application\/json/);

        });

        it('Deve lançar erro 400 por ID inválido.', async () => {
            const invalidId = 'invalidId';
            const newsInput = newsFactory();

            const response = await request(app)
                .put(`/v1/news/${invalidId}`)
                .send(newsInput);

            expect(response.status).toBe(400);
            expect(response.body).toBe(MESSAGES_ERROR.GENERAL.INVALID_ID);
        });

        it('Deve lançar erro 404 por ID não encontrado.', async () => {
            const notFoundId = new mongoose.Types.ObjectId(); 
            const newsInput = newsFactory();

            const response = await request(app)
                .put(`/v1/news/${notFoundId}`)
                .send(newsInput);

            expect(response.status).toBe(404);
            expect(response.body).toContain(MESSAGES_ERROR.NEWS.NOT_FOUND);
        });
    });

    describe('Search', () => {

        it('Deve pesquisar notícias com sucesso.', async () => {

        });
    });
});