import type { Request, Response, NextFunction } from 'express';
import type { NewsInputData } from '../../schemas/news-schema.ts';
import { NewsUpdateService } from '../../services/news/news-update-service.ts';

interface UpdateNewsRequest extends Request {
    params: {
        id: string;
    };
    body: Partial<NewsInputData>;
}

export class NewsUpdateController {

    public async updateById(request: UpdateNewsRequest, response: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = request.params;
            const newsInput = request.body;

            const updatedNews = await new NewsUpdateService().updateById(id, newsInput);
            
            response.status(200).json(updatedNews);

        } catch (error) {
            next(error);
        }
    }
}