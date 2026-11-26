import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { NewsUpdateService } from '../../services/news/news-update-service.ts';
import { validateFormatId } from '../../utils/utils.ts';

export class NewsUpdateController {

    public async updateById(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const paramsValidation = z.object({
                id: z.string()
            });
            const { id } = paramsValidation.parse(request.params);
            validateFormatId(id);

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