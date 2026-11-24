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
            newsInput.chapeu = 'C'; 
            newsInput.titulo = 'T'; 
            newsInput.linhaFina = 'L'; 
            newsInput.conteudo = 'C'; 
            newsInput.autor = "A";
            newsInput.imagemUrl = 'I';
            newsInput.imagemLegenda = 'L';
            newsInput.linkOriginal = 'L';

            const response = await request(app)
                .post('/v1/news')
                .send(newsInput);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(MESSAGES_ERROR.GENERAL.DATA_VALIDATION_ERRORS);
            expect(response.body.issues.properties["chapeu"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_HAT_MIN_CARACTERES(NEWS_RULES.HAT.MIN));
            expect(response.body.issues.properties["titulo"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_TITLE_MIN_CARACTERES(NEWS_RULES.TITLE.MIN));
            expect(response.body.issues.properties["linhaFina"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_SUBHEADLINE_MIN_CARACTERES(NEWS_RULES.SUBHEADLINE.MIN));
            expect(response.body.issues.properties["conteudo"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_CONTENT_MIN_CARACTERES(NEWS_RULES.CONTENT.MIN));
            expect(response.body.issues.properties["autor"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_AUTHOR_MIN_CARACTERES(NEWS_RULES.AUTHOR.MIN));
            expect(response.body.issues.properties["imagemUrl"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_IMAGE_URL_MIN_CARACTERES(NEWS_RULES.IMAGE_URL.MIN));
            expect(response.body.issues.properties["imagemLegenda"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_IMAGE_CAPTION_MIN_CARACTERES(NEWS_RULES.IMAGE_CAPTION.MIN));
            expect(response.body.issues.properties["linkOriginal"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_LINK_ORIGINAL_MIN_CARACTERES(NEWS_RULES.LINK_ORIGINAL.MIN));
        });
    });

    describe('UpdateById', () => {

        it('Deve atualizar uma notícia com sucesso.', async () => {
            const newsInput = newsFactory();
            const newsCreated = await newsRepository.create(newsInput);

            const newsUpdate = newsFactory({ 
                chapeu: 'Chapéu Atualizado', 
                titulo: 'Título Atualizado Título Atualizado', 
                linhaFina: 'Linha Fina Atualizada Linha Fina Atualizada Linha Fina Atualizada Linha Fina Atualizada Linha Fina Atualizada', 
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

        it('Deve lançar erro 400 por dados inválidos - Schema Validation.', async () => {
            const newsInput = newsFactory();
            const newsCreated = await newsRepository.create(newsInput);

            const newsUpdate = newsFactory({ 
                chapeu: 'Chapéu atualizado > 20 caracteres.', 
                titulo: 'Título Atualizado > 100 caractres. Título Atualizado Título Atualizado > 100 caractres. Título Atualizado', 
                linhaFina: 'Linha Fina Atualizada > 200 caractres. Linha Fina Atualizada Linha Fina Atualizada > 200 caractres. Linha Fina Atualizada Linha Fina Atualizada Linha Fina Atualizada Linha Fina Atualizada Linha Fina Atualizada', 
                conteudo: 'Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado Conteúdo Atualizado', 
                autor: 'Autor atualizado > 50 caracteres. Autor atualizado > 50 caracteres.', 
                imagemUrl: 'URL', 
                imagemLegenda: 'Legenda atualizada > 80 caracteres. Legenda atualizada > 80 caracteres. Legenda atualizada > 80 caracteres.', 
                linkOriginal: 'L', 
                destaquePrincipal: true, 
                destaqueSecundario: true, 
                editoria: 'entretenimento' 
            });

            const response = await request(app)
                .put(`/v1/news/${newsCreated._id}`)
                .send(newsUpdate);

            expect(response.body.message).toBe(MESSAGES_ERROR.GENERAL.DATA_VALIDATION_ERRORS);
            expect(response.body.issues.properties["chapeu"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_HAT_MAX_CARACTERES(NEWS_RULES.HAT.MAX));
            expect(response.body.issues.properties["titulo"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_TITLE_MAX_CARACTERES(NEWS_RULES.TITLE.MAX));
            expect(response.body.issues.properties["linhaFina"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_SUBHEADLINE_MAX_CARACTERES(NEWS_RULES.SUBHEADLINE.MAX));
            expect(response.body.issues.properties["autor"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_AUTHOR_MAX_CARACTERES(NEWS_RULES.AUTHOR.MAX));
            expect(response.body.issues.properties["imagemUrl"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_IMAGE_URL_MIN_CARACTERES(NEWS_RULES.IMAGE_URL.MIN));
            expect(response.body.issues.properties["imagemLegenda"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_IMAGE_CAPTION_MAX_CARACTERES(NEWS_RULES.IMAGE_CAPTION.MAX));
            expect(response.body.issues.properties["linkOriginal"].errors)
                .toContain(MESSAGES_ERROR.NEWS.FIELD_LINK_ORIGINAL_MIN_CARACTERES(NEWS_RULES.LINK_ORIGINAL.MIN));
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