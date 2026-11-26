import type { Request, Response, NextFunction } from 'express';
import { NewsSearchService } from '../../services/news/news-search-service.ts';
import { searchQueryValidation } from '../../validation/news-schema-validation.ts';

export class NewsSearchController {

    public async searchOffsetBased(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const { section, title, subHeadLine, numPage, numLimitItemsPerPage } = searchQueryValidation.parse(request.query);

            const newsPaginated = await new NewsSearchService().searchOffsetBased({
                section,
                title,
                subHeadLine,
                numPage,
                numLimitItemsPerPage
            })

            response.status(200).json(newsPaginated);

        } catch (error) {
            next(error);
        }
    }
} 