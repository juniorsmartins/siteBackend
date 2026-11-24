import type { NewsInputData, NewsOutputLean } from '../../schemas/news-schema.ts';
import { validateFormatId } from '../../utils/utils.ts';
import { newsRepository } from '../../repositories/news-repository.ts';
import { checkExistsNewsById } from '../../utils/news-utils.ts';

export class NewsUpdateService {

    public async updateById(id: string, newsInput: Partial<NewsInputData>): Promise<NewsOutputLean | null> {

        validateFormatId(id);
        await checkExistsNewsById(id);

        return await newsRepository.updateById(id, newsInput);
    }
}