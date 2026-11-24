import { News } from '../schemas/news-schema.ts';
import type { NewsOutputLean, NewsInputData } from '../schemas/news-schema.ts';
import type { QueryFilter, Types } from 'mongoose';

type Id = string | Types.ObjectId;

export const newsRepository = {

    // ---------------------------------------------------------------------
    // CRUD
    // ---------------------------------------------------------------------

    async create(newsInput: NewsInputData): Promise<NewsOutputLean> {
        const noticia = await News.create(newsInput);
        return noticia.toObject() as NewsOutputLean;
    },

    async findById(id: Id): Promise<NewsOutputLean | null> {
        return await News.findById(id).lean<NewsOutputLean>();
    },

    async updateById(id: Id, newsInput: Partial<NewsInputData>): Promise<NewsOutputLean | null> {
        return await News.findByIdAndUpdate(
            id,
            { $set: newsInput },
            { new: true, runValidators: true } 
        ).lean<NewsOutputLean>(); 
    },

    async deleteById(id: Id): Promise<NewsOutputLean | null> {
        return await News.findByIdAndDelete(id).lean<NewsOutputLean>();
    },


    // ---------------------------------------------------------------------
    // VERIFICAÇÕES
    // ---------------------------------------------------------------------

    async existePorId(id: Id): Promise<boolean> {
        const resultado = await News.exists({ _id: id });
        return !!resultado;
    },

    // ---------------------------------------------------------------------
    // VERIFICAÇÃO DE DUPLICIDADE (usada pela automação de importação)
    // ---------------------------------------------------------------------

    // async buscarPorLinkOriginal(linkOriginal) {
    //     if (!linkOriginal) return null;
    //     return await News.findOne({ linkOriginal }).lean();
    // },

    // async buscarPorTitulo(titulo) {
    //     if (!titulo) return null;
    //     return await News.findOne({ titulo }).lean();
    // },

    /**
     * Busca uma notícia duplicada considerando APENAS as chaves reais informadas.
     * Evita o bug de {} vazio (que casaria com qualquer documento).
     */
    // async buscarDuplicata({ linkOriginal, titulo }) {
    //     const condicoes = [];
    //     if (linkOriginal) condicoes.push({ linkOriginal });
    //     if (titulo) condicoes.push({ titulo });

    //     if (condicoes.length === 0) return null;

    //     return await News.findOne({ $or: condicoes })
    //         .select({ _id: 1 })
    //         .lean();
    // },

    // async existePorLinkOriginal(linkOriginal) {
    //     if (!linkOriginal) return false;
    //     const resultado = await News.exists({ linkOriginal }).lean();
    //     return !!resultado;
    // },

    // async existePorId(id) {
    //     const resultado = await News.exists({ _id: id }).lean();
    //     return !!resultado;
    // },

    // ---------------------------------------------------------------------
    // LISTAGEM / BUSCA
    // ---------------------------------------------------------------------
    // async listarTodas() {
    //     return await News.find()
    //         .sort({ createdAt: -1 })
    //         .lean();
    // },

    // async pesquisarComFiltroPaginado({ filtro, pular, limitePorPagina }) {
    //     return await Promise.all([
    //         News.find(filtro)
    //             .sort({ createdAt: -1 })
    //             .skip(pular)
    //             .limit(limitePorPagina)
    //             .lean(),
    //         News.countDocuments(filtro)
    //     ]);
    // },

    // async buscarUltimas(limite = 10) {
    //     return await News.find()
    //         .sort({ createdAt: -1 })
    //         .limit(limite)
    //         .lean();
    // },

    // async buscarPorEditoria(editoria, limite = 10) {
    //     return await News.find({ editoria })
    //         .sort({ createdAt: -1 })
    //         .limit(limite)
    //         .lean();
    // },

    // ---------------------------------------------------------------------
    // DESTAQUES
    // ---------------------------------------------------------------------

    // async buscarDestaquesPrincipais(limite = 5) {
    //     return await News.find({ destaquePrincipal: true })
    //         .sort({ createdAt: -1 })
    //         .limit(limite)
    //         .lean();
    // },

    // async buscarDestaquesSecundarios(limite = 5) {
    //     return await News.find({ destaqueSecundario: true })
    //         .sort({ createdAt: -1 })
    //         .limit(limite)
    //         .lean();
    // },

    // ---------------------------------------------------------------------
    // EXCLUSÃO E CONTAGEM
    // ---------------------------------------------------------------------

    // async deleteAll() {
    //     return await News.deleteMany({});
    // },

    // async contarTodas() {
    //     return await News.countDocuments();
    // },

    // async contarPorEditoria(editoria) {
    //     return await News.countDocuments({ editoria });
    // }
};