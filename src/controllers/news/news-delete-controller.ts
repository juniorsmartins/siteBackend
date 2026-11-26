import type { Request, Response, NextFunction } from "express";
import { NewsDeleteService } from "../../services/news/news-delete-service.ts";
import { MESSAGES_SUCCESS } from "../../configs/messages-success-config.ts";
import { idParamValidation } from "../../validation/news-schema-validation.ts";

export class NewsDeleteController {

    public async deleteById(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = idParamValidation.parse(request.params);

            const idDeleted = await new NewsDeleteService().deleteById(id);

            response.status(200).json({
                message: MESSAGES_SUCCESS.NEWS.DELETED,
                idDeleted: idDeleted
            });

        } catch (error) {
            next(error);
        }
    }
}