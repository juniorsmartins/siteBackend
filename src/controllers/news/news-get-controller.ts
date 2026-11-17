import type { Request, Response, NextFunction } from "express";
import { NewsGetService } from "../../services/news/news-get-service.ts";

export class NewsGetController {

    /**
     * BuscarPorId - Get para exibir um registro específico
     * index - Get para pesquisar vários registros paginados
     */

    public async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = req.params;
            const resposta = await new NewsGetService().buscarPorId(id as string);

            res.status(200).json(resposta);

        } catch (error) {
            next(error);
        }
    }
}