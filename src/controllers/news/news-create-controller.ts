import type { Request, Response, NextFunction } from "express";
import { NewsCreateService } from "../../services/news/news-create-service.ts";

export class NewsCreateController {

    public async criar(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const dadosNoticia = req.body;
            const resposta = await new NewsCreateService().criar(dadosNoticia);

            res.status(201).json(resposta);

        } catch (error) {
            next(error);
        }
    }
}