import { newsRepository } from '../repositories/news-repository.ts';
import { AppError } from '../error/app-error.ts';
import { MESSAGES_ERROR } from '../error/messages-error.ts';

export async function verificarExisteNewsPorId(id: string): Promise<void> {
    const existe = await newsRepository.existePorId(id);
    if (!existe) {
        throw new AppError(MESSAGES_ERROR.NEWS.NAO_ENCONTRADO, 404);
    }
}
