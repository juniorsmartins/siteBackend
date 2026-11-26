import type { Request, Response, NextFunction } from "express";
import { NewsFindService } from "../../services/news/news-find-service.ts";
import { idParamValidation } from '../../validation/news-schema-validation.ts';

export class NewsFindController {

    public async findById(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = idParamValidation.parse(request.params);

            const newsFind = await new NewsFindService().findById(id);

            response.status(200).json(newsFind);

        } catch (error) {
            next(error);
        }
    }
}