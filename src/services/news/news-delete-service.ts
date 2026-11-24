import { newsRepository } from '../../repositories/news-repository.ts';
import { validateFormatId } from '../../utils/utils.ts';
import { checkExistsNewsById } from '../../utils/news-utils.ts';

export class NewsDeleteService {

    public async deleteById(id: string): Promise<string> {

        validateFormatId(id);
        await checkExistsNewsById(id);
        await newsRepository.deleteById(id);

        return id;
    }
}