import { newsRepository } from '../../repositories/news-repository.ts';
import type { NewsLean } from '../../models/news-schema.ts';
import { AppError } from '../../error/app-error.ts';
import { MESSAGES_ERROR } from '../../error/messages-error.ts';
import { validarFormatoId } from '../../utils/utils.ts';

export class NewsGetService {

    public async buscarPorId(id: string): Promise<NewsLean | null> {

        validarFormatoId(id);
        
        const news = await newsRepository.buscarPorId(id);
        if (!news) {
            throw new AppError(MESSAGES_ERROR.NEWS.NAO_ENCONTRADO, 404);
        }

        return news;
    }
}