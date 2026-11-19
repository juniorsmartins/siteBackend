import type { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error.ts";
import { ZodError, z } from "zod";
import { MESSAGES_ERRO } from "../configs/messages-config.ts";

export function errorHandler(error: any, request: Request, response: Response, next: NextFunction): any {

    // Erros personalizados
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({"ErrorHandler": error.message });
    }

    // Erros do Zod (validação de dados)
    if (error instanceof ZodError) {
        return response.status(400).json({ 
            message: "ErrorHandler - Erro de validação de dados.",
            issues: z.treeifyError(error)
        });
    }

    // Erros não tratados
    return response.status(500).json({ ErrorHandler: MESSAGES_ERRO.GERAL.ERRO_INTERNO, error: error?.message });
}

