import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { NewsSearchService } from '../../services/news/news-search-service.ts';
import { NEWS_RULES } from '../../configs/constants-config.ts';
import { MESSAGES_ERROR } from '../../errors/messages-error.ts';

export class NewsSearchController {

    public async searchOffsetBased(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const queryValidation = z.object({
                section: z.string().trim().optional(),
                title: z.string().trim().optional(),
                subHeadLine: z.string().trim().optional(),

                numPage: z.string()
                    .optional()
                    .default(`${NEWS_RULES.PAGINATION.DEFAULT_PAGE}`)
                    .transform((value) => Number(value))
                    .refine((value) => !isNaN(value) && value > 0, { message: 
                        MESSAGES_ERROR.PAGINATION.NUM_PAGE_MUST_BE_GREATER_THAN_ZERO 
                    }),

                numLimitItemsPerPage: z.string()
                    .optional()
                    .default(`${NEWS_RULES.PAGINATION.DEFAULT_LIMIT_ITEMS_PER_PAGE}`)
                    .transform((value) => Number(value))
                    .refine((value) => !isNaN(value) && value > 0, { message: 
                        MESSAGES_ERROR.PAGINATION.NUM_LIMIT_ITEMS_PER_PAGE_MUST_BE_GREATER_THAN_ZERO 
                    })
            })
            const { section, title, subHeadLine, numPage, numLimitItemsPerPage } = queryValidation.parse(request.query);

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