import type { Request, Response, NextFunction } from "express";

type Connect = () => Promise<void>;

/**
 * Cria um middleware que garante o banco conectado antes de seguir para as rotas.
 * Recebe a função de conexão por parâmetro (não conhece Mongoose nem variáveis de ambiente).
 * Em caso de falha, delega ao errorHandler com next(error).
 */
export const createDatabaseConnectionMiddleware = 
(connect: Connect) => async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
        await connect();
        next();

    } catch (error) {
        next(error);
    }
};