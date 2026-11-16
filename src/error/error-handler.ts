import type { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error.ts";

export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction): any {

    // Erros personalizados
    if (error instanceof AppError) {
        return response.status(error.statusCode).json(error.message);
    }

    // Erros não tratados
    return response.status(500).json("Erro interno do servidor");
}

