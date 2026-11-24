import { newsRepository } from '../../repositories/news-repository.ts';
import type { NewsInputData, NewsOutputLean } from '../../schemas/news-schema.ts';

export class NewsCreateService {

    public async create(newsInput: NewsInputData): Promise<NewsOutputLean> {

        const { chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, 
            linkOriginal, destaquePrincipal, destaqueSecundario, editoria } = newsInput;

        const noticiaCriada = await newsRepository.create({ chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, 
            linkOriginal, destaquePrincipal, destaqueSecundario, editoria });

        return noticiaCriada;
    }
}