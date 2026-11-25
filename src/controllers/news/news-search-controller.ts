import type { Request, Response, NextFunction } from 'express';
import { NewsSearchService } from '../../services/news/news-search-service.ts';
import { NEWS_RULES } from '../../configs/constants-config.ts';

interface SearchNewsRequest extends Request {
    query: {
        section?: string;
        title?: string;
        subHeadLine?: string;
        numPage?: string;
        numLimitItemsPerPage?: string;
    }
}

export class NewsSearchController {

    public async search(request: SearchNewsRequest, response: Response, next: NextFunction): Promise<void> {

        try {
            const { section, title, subHeadLine, numPage, numLimitItemsPerPage } = request.query;

            const pageNumber = numPage ? parseInt(numPage, 10) : NEWS_RULES.PAGINATION.DEFAULT_PAGE; 
            const limitNumber = numLimitItemsPerPage ? parseInt(numLimitItemsPerPage, 10) : NEWS_RULES.PAGINATION.DEFAULT_LIMIT_ITEMS_PER_PAGE;

            const newsPaginated = await new NewsSearchService().search({ section, title, subHeadLine,
                numPage: pageNumber > 0 ? pageNumber : NEWS_RULES.PAGINATION.DEFAULT_PAGE,
                numLimitItemsPerPage: limitNumber > 0 ? limitNumber : NEWS_RULES.PAGINATION.DEFAULT_LIMIT_ITEMS_PER_PAGE
            });

            response.status(200).json(newsPaginated);

        } catch (error) {
            next(error);
        }
    }
} 