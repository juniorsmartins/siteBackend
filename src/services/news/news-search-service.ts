import type { QueryFilter } from 'mongoose';
import { newsRepository } from '../../repositories/news-repository.ts';
import type { NewsOutputLean, NewsSchemaType } from '../../schemas/news-schema.ts';
import type { EditoriaType } from '../../types/editoria-type.ts';

export class NewsSearchService {

    public async searchOffsetBased({ section, title, subHeadLine, numPage, numLimitItemsPerPage }: 
        { section?: string; title?: string; subHeadLine?: string; numPage: number; numLimitItemsPerPage: number }): Promise<any> {

        const filters: QueryFilter<NewsSchemaType> = {};

        if (section && section.trim() !== "") {
            filters.editoria = section.trim() as EditoriaType; // Cast para o tipo EditoriaType
        }

        if (title && title.trim() !== "") {
            filters.titulo = title.trim();
        }

        if (subHeadLine && subHeadLine.trim() !== "") {
            filters.linhaFina = subHeadLine.trim();
        }

        // Calcula o número de itens a pular com base na página atual e no limite por página
        const skipPage = (numPage - 1) * numLimitItemsPerPage;

        const [newsPaginated, totalRecords] = await newsRepository.searchOffsetBased({
            filters,
            skipPage,
            numLimitItemsPerPage
        });

        const newsTranslated = (newsPaginated || []).map((news: NewsOutputLean) => ({
            _id: news._id,
            hat: news.chapeu,
            title: news.titulo,
            subHeadLine: news.linhaFina,
            content: news.conteudo,
            author: news.autor,
            imageUrl: news.imagemUrl,
            imageCaption: news.imagemLegenda,
            originalLink: news.linkOriginal,
            section: news.editoria, 
        }));

        const totalPages = Math.ceil((totalRecords || 0) / numLimitItemsPerPage) || 1;

        return {
            news: newsTranslated, 
            totalRecords: totalRecords || 0,
            currentPage: numPage,
            totalPages: totalPages, 
            numLimitItemsPerPage: numLimitItemsPerPage
        };
    };
}