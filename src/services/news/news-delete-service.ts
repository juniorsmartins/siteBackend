import { newsRepository } from '../../repositories/news-repository.ts';
import { AppError } from '../../errors/app-error.ts';
import { MESSAGES_ERROR } from '../../errors/messages-error.ts';

export class NewsDeleteService {

    public async deleteById(id: string): Promise<string> {

        const newsDeleted = await newsRepository.deleteById(id);
        if(!newsDeleted) {
            throw new AppError(MESSAGES_ERROR.NEWS.NOT_FOUND, 404);
        }

        return id;
    }
}