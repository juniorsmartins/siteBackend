import type { Request, Response, NextFunction } from "express";
import { NewsDeleteService } from "../../services/news/news-delete-service.ts";
import { MESSAGES_SUCCESS } from "../../configs/messages-success-config.ts";
import { validateFormatId } from "../../utils/utils.ts";

export class NewsDeleteController {

    public async deleteById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = req.params;
            validateFormatId(id);
            const idDeleted = await new NewsDeleteService().deleteById(id);

            res.status(200).json({
                message: MESSAGES_SUCCESS.NEWS.DELETED,
                idDeleted: idDeleted
            });

        } catch (error) {
            next(error);
        }
    }
}