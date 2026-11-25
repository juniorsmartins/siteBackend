import { newsRepository } from '../../repositories/news/news-repository.ts';

export class NewsSearchService {

    public async search({ section, title, subHeadLine, numPage, numLimitItemsPerPage }: 
        { section?: string; title?: string; subHeadLine?: string; numPage: number; numLimitItemsPerPage: number }): Promise<any> {

        const newsPaginated = await newsRepository.search({ section, title, subHeadLine, numPage, numLimitItemsPerPage });

        return newsPaginated;
    };
}