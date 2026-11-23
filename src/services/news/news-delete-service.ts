import { newsRepository } from '../../repositories/news-repository.ts';
import { validarFormatoId } from '../../utils/utils.ts';
import { verificarExisteNewsPorId } from '../../utils/news-utils.ts';

export class NewsDeleteService {

    public async deleteById(id: string): Promise<string> {

        validarFormatoId(id);
        await verificarExisteNewsPorId(id);
        await newsRepository.deletarPorId(id);

        return id;
    }
}