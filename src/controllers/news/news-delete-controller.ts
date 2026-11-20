import type { Request, Response, NextFunction } from "express";
import { NewsDeleteService } from "../../services/news/news-delete-service.ts";
import { MESSAGES_SUCCESS } from "../../error/messages-success.ts";

export class NewsDeleteController {

    public async deletarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = req.params;
            const resposta = await new NewsDeleteService().deletarPorId(id);

            res.status(200).json({
                sucesso: true, 
                mensagem: MESSAGES_SUCCESS.NEWS.DELETADO,
                resposta
            });

        } catch (error) {
            next(error);
        }
    }
}
