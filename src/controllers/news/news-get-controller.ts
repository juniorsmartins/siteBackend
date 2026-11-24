import type { Request, Response, NextFunction } from "express";
import { NewsGetService } from "../../services/news/news-get-service.ts";

export class NewsGetController {

    public async findById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = req.params;
            const newsFind = await new NewsGetService().findById(id);

            res.status(200).json(newsFind);

        } catch (error) {
            next(error);
        }
    }
}