import { newsRepository } from '../repositories/news-repository.ts';
import { AppError } from '../errors/app-error.ts';
import { MESSAGES_ERROR } from '../errors/messages-error.ts';

export async function checkExistsNewsById(id: string): Promise<void> {
    const exist = await newsRepository.existePorId(id);
    if (!exist) {
        throw new AppError(MESSAGES_ERROR.NEWS.NOT_FOUND, 404);
    }
}
