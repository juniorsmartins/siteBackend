import type { Request, Response, NextFunction } from "express";

export const validateSchemaMiddleware = (schema: any) => {

    return (request: Request, response: Response, next: NextFunction) => {

        try {
            schema.parse(request.body);
            next(); // Continua para o próximo middleware se a validação passar

        } catch (error: any) {
            next(error); // Passa o erro para o middleware de tratamento de erros
        }
    }
}