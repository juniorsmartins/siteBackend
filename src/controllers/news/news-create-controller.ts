import type { Request, Response, NextFunction } from "express";
import { NewsCreateService } from "../../services/news/news-create-service.ts";

export class NewsCreateController {

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const newsInput = req.body;
            const newsCreated = await new NewsCreateService().create(newsInput);

            res.status(201).json(newsCreated);

        } catch (error) {
            next(error);
        }
    }
}