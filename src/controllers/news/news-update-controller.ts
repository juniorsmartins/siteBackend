import { Request, Response, NextFunction } from 'express';
import { NewsCreateData } from '../../schemas/news-schema';

interface UpdateNewsRequest extends Request {
    params: {
        id: string;
    };
    body: Partial<NewsCreateData>;
}

export class NewsUpdateController {

    public async update(request: UpdateNewsRequest, response: Response, next: NextFunction): Promise<void> {

        try {


        } catch (error) {
            next(error);
        }
    }
}