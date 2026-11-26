import type { Request, Response, NextFunction } from 'express';
import { NewsUpdateService } from '../../services/news/news-update-service.ts';
import { idParamValidation } from '../../validation/news-schema-validation.ts';

export class NewsUpdateController {

    public async updateById(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const { id } = idParamValidation.parse(request.params);

            const { chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, linkOriginal, 
                editoria, destaquePrincipal, destaqueSecundario } = request.body;

            const updatedNews = await new NewsUpdateService().updateById(id, { 
                chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, linkOriginal, 
                editoria, destaquePrincipal, destaqueSecundario });
            
            response.status(200).json(updatedNews);

        } catch (error) {
            next(error);
        }
    }
}