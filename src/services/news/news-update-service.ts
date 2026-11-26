import type { NewsInputData, NewsOutputLean } from '../../schemas/news-schema.ts';
import { newsRepository } from '../../repositories/news-repository.ts';
import { AppError } from '../../errors/app-error.ts';
import { MESSAGES_ERROR } from '../../errors/messages-error.ts';

export class NewsUpdateService {

    public async updateById(id: string, newsInput: Partial<NewsInputData>): Promise<NewsOutputLean | null> {

        const newsUpdated = await newsRepository.updateById(id, newsInput);
        if(!newsUpdated) {
            throw new AppError(MESSAGES_ERROR.NEWS.NOT_FOUND, 404);
        }

        return newsUpdated;
    }
}