import { newsRepository } from '../../repositories/news-repository.ts';
import type { NewsOutputLean } from '../../schemas/news-schema.ts';
import { AppError } from '../../errors/app-error.ts';
import { MESSAGES_ERROR } from '../../errors/messages-error.ts';
import { validateFormatId } from '../../utils/utils.ts';

export class NewsGetService {

    public async findById(id: string): Promise<NewsOutputLean> {

        validateFormatId(id);
        
        const newsFound = await newsRepository.findById(id);
        if (!newsFound) {
            throw new AppError(MESSAGES_ERROR.NEWS.NOT_FOUND, 404);
        }

        return newsFound;
    }
}