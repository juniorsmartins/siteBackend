import { newsRepository } from '../../repositories/news-repository.ts';
import type { NewsLean } from '../../models/news-schema.ts';
import { AppError } from '../../error/app-error.ts';
import { MESSAGES_ERRO } from '../../configs/messages-config.ts';

export class NewsGetService {

    public async buscarPorId(id: string): Promise<NewsLean | null> {

        const news = await newsRepository.buscarPorId(id);
        if (!news) {
            throw new AppError(MESSAGES_ERRO.NEWS.NAO_ENCONTRADO, 404);
        }

        return news;
    }
}