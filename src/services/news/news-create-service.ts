import { newsRepository } from '../../repositories/news-repository.ts';
import type { NewsLean, NewsCreateData } from '../../schemas/news-schema.ts';

export class NewsCreateService {

    public async create(dadosNoticia: NewsCreateData): Promise<NewsLean> {

        const { chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, 
            linkOriginal, destaquePrincipal, destaqueSecundario, editoria } = dadosNoticia;

        const noticiaCriada = await newsRepository.create({ chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, 
            linkOriginal, destaquePrincipal, destaqueSecundario, editoria });

        return noticiaCriada;
    }
}