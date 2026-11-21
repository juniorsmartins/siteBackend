import { newsRepository } from '../../repositories/news-repository.ts';
import type { NewsLean, NewsCreateData } from '../../schemas/news-schema.ts';

export class NewsCreateService {

    public async criar(dadosNoticia: NewsCreateData): Promise<NewsLean> {

        const { chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, 
            linkOriginal, destaquePrincipal, destaqueSecundario, editoria } = dadosNoticia;

        const noticiaCriada = await newsRepository.criar({ chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, 
            linkOriginal, destaquePrincipal, destaqueSecundario, editoria });

        return noticiaCriada;
    }
}