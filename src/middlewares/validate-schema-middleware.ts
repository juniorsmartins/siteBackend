import type { Request, Response, NextFunction } from "express";

// Tipo que permite escolher qual parte da requisição validar (padrão: body)
type RequestLocation = "body" | "query" | "params";

export const validateSchemaMiddleware = (schema: any, location: RequestLocation = "body") => {

    return (request: Request, response: Response, next: NextFunction): void => {

        try {
            schema.parse(request[location]);
            next(); // Continua para o próximo middleware se a validação passar

        } catch (error: any) {
            next(error); // Passa o erro para o middleware de tratamento de erros
        }
    }
}