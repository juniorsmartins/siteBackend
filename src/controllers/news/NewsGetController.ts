import type { Request, Response, NextFunction } from "express";

export class NewsGetController {

    /**
     * Show - Get para exibir um registro específico
     * index - Get para pesquisar vários registros paginados
     */

    public async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log("Requisição recebida no endpoint raiz.");

        res.status(200).json({ user_id: req.user_id });
    }
}